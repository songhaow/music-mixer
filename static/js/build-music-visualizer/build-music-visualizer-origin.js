// Original script codes copied from html

  const analyser = audioContext.createAnalyser();
  masterGain.connect(analyser);
  const waveform = new Float32Array(analyser.frequencyBinCount);
  analyser.getFloatTimeDomainData(waveform);

  function updateWaveform() {
    requestAnimationFrame(updateWaveform);
    analyser.getFloatTimeDomainData(waveform);
  }

  const spectrum = new Uint8Array(analyser.frequencyBinCount);
  function updateSpectrum() {
    requestAnimationFrame(updateSpectrum);
    analyser.getByteFrequencyData(spectrum);
  }

  const spectroCanvas = document.getElementById('spectrogram');
  spectroCanvas.width = spectrum.length;
  spectroCanvas.height = 200;
  const spectroContext = spectroCanvas.getContext('2d');
  let spectroOffset = 0;

  function initQuad(gl) {
    const vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo)
    const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  }

  function renderQuad(gl) {
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  function createShader(gl, vertexShaderSrc, fragmentShaderSrc) {
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexShaderSrc);
    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
      throw new Error(gl.getShaderInfoLog(vertexShader));
    }

    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentShaderSrc);
    gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
      throw new Error(gl.getShaderInfoLog(fragmentShader));
    }

    const shader = gl.createProgram();
    gl.attachShader(shader, vertexShader);
    gl.attachShader(shader, fragmentShader);
    gl.linkProgram(shader);
    gl.useProgram(shader);
    return shader
  }

  attribute vec2 position;
  void main(void) {
    gl_Position = vec4(position, 0, 1);
  }

precision mediump float;

uniform float time;
uniform vec2 resolution;
uniform sampler2D spectrum;

void main(void) {
  vec3 c;
  float z = 0.1 * time;
  vec2 uv = gl_FragCoord.xy / resolution;
  vec2 p = uv - 0.5;
  p.x *= resolution.x / resolution.y;
  float l = 0.2 * length(p);
  for (int i = 0; i < 3; i++) {
    z += 0.07;
    uv += p / l * (sin(z) + 1.0) * abs(sin(l * 9.0 - z * 2.0));
    c[i] = 0.01 / length(abs(mod(uv, 1.0) - 0.5));
  }
  float intensity = texture2D(spectrum, vec2(l, 0.5)).x;
  gl_FragColor = vec4(c / l * intensity, time);
}

// https://www.shadertoy.com/view/MtlBDf
// void mainImage( out vec4 fragColor, in vec2 fragCoord ){
//     vec2 p = fragCoord/iResolution.xy - 0.5; // -0.5 -- 0.5
//     p.x*=iResolution.x/iResolution.y;
// 	float l = length(p);
//     float t = iTime;
//
// 	vec3 c;
//     for(int i=0;i<=2;i++) {
// 		t+=.07;
//         vec2 a = p + p/l * (1.+cos(t)) * abs(sin(l*9.-t*2.));
// 		c[i]=.01/length( fract(0.5+a)-0.5 );
//     }
// 	fragColor=vec4(c/l,0.);
// }

// http://www.pouet.net/prod.php?which=57245
// If you intend to reuse this shader, please add credits to 'Danilo Guanabara'
// #define t iTime
// #define r iResolution.xy
//
// void mainImage( out vec4 fragColor, in vec2 fragCoord ){
// 	vec3 c;
// 	float l,z=t;
// 	for(int i=0;i<3;i++) {
// 		vec2 uv,p=fragCoord.xy/r;
// 		uv=p;
// 		p-=.5;
// 		p.x*=r.x/r.y;
// 		z+=.07;
// 		l=length(p);
// 		uv+=p/l*(sin(z)+1.)*abs(sin(l*9.-z*2.));
// 		c[i]=.01/length(abs(mod(uv,1.)-.5));
// 	}
// 	fragColor=vec4(c/l,t);
// }

function createTexture(gl) {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  return texture
}

function copyAudioDataToTexture(gl, audioData, textureArray) {
  for (let i = 0; i < audioData.length; i++) {
    textureArray[4 * i + 0] = audioData[i] // R
    textureArray[4 * i + 1] = audioData[i] // G
    textureArray[4 * i + 2] = audioData[i] // B
    textureArray[4 * i + 3] = 255          // A
  }
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, audioData.length, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, textureArray);
}

const fragCanvas = document.getElementById('fragment');
fragCanvas.width = fragCanvas.parentNode.offsetWidth;
fragCanvas.height = fragCanvas.width * 0.75;
const gl = fragCanvas.getContext('webgl') || fragCanvas.getContext('experimental-webgl');
const vertexShaderSrc = document.getElementById('vertex-shader').textContent;
const fragmentShaderSrc = document.getElementById('fragment-shader').textContent;
const fragShader = createShader(gl, vertexShaderSrc, fragmentShaderSrc);

const fragPosition = gl.getAttribLocation(fragShader, 'position');
gl.enableVertexAttribArray(fragPosition);
const fragTime = gl.getUniformLocation(fragShader, 'time');
gl.uniform1f(fragTime, audioContext.currentTime);
const fragResolution = gl.getUniformLocation(fragShader, 'resolution');
gl.uniform2f(fragResolution, fragCanvas.width, fragCanvas.height)
const fragSpectrumArray = new Uint8Array(4 * spectrum.length);
const fragSpectrum = createTexture(gl);

initQuad(gl);

function renderFragment() {
  requestAnimationFrame(renderFragment);
  gl.uniform1f(fragTime, audioContext.currentTime);
  copyAudioDataToTexture(gl, spectrum, fragSpectrumArray);
  renderQuad(gl)
}
