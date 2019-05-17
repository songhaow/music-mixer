let audioContext, masterGain;

// var trackAudioManager = new TrackAudioManager();

$(function main () {  // When this main() is operating?
  audioContext = new (window.AudioContext || window.webkitAudioContext)();
  masterGain = audioContext.createGain();
  masterGain.connect(audioContext.destination);
  // const song = new Audio('//zacharydenton.github.io/noisehack/static/zero_centre.mp3')
  const song = new Audio('../static/source_audio/eyes.m4a');
  // const song = new Audio('../static/source_audio/'+trackAudioManager.songBufferInfo[i].trackName);
  song.crossOrigin = 'anonymous';
  const songSource = audioContext.createMediaElementSource(song);
  let songPlaying = false;
  songSource.connect(masterGain);

  // $('.play-btn').click(createSawOscillator);
  $('.song-btn').click(function() {
    if (songPlaying) {
      $('.song-btn').text('Play Song');
      song.pause();
    } else {
      $('.song-btn').text('Pause');
      song.play();
    }
    songPlaying = !songPlaying;// if playing=true set to fal
  })
  $('pre.sourceCode.javascript').each(function() { //??????????????? okay I know
    const script = document.createElement('script');
    script.textContent = this.textContent;
    this.parentNode.insertBefore(script, this);
  })
})
