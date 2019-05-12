// todo: don't export audioCtx directly
import {audioCtx, TrackAudioManager} from '/static/js/audio_logic/audio_context_logic.js';
import {TrackCanvasInterface} from '/static/js/view/track_canvas/main_render.js';
// AudioSourceInterface.loadBackendTrack(trackAudioManager, trackAudioManager.track2Name);
// var sitename = 'http://localhost:8080/song-meta?songName=';

export const AudioSourceInterface = {
  loadBackendTrack(i, trackAudioManager, songName) {
    var xhr = new XMLHttpRequest();
    // GET the song from the backend python server
    xhr.open('GET', 'http://localhost:8000/song-meta?songName=' + songName, true);
    xhr.responseType = 'json';
    xhr.onload = function () {
      fetchAndLoadSongContent(i, trackAudioManager, songName, xhr.response.beat_list, xhr.response.bpm);
    };
    console.log('Loading backend track - 01');
    xhr.send();
  }
};

function fetchAndLoadSongContent(i, trackAudioManager, songName, beat_list, bpm) {
  var xhr = new XMLHttpRequest();
  // trackAudioManager.songBufferInfo[i].trackname = songName;
  trackAudioManager.songBufferInfo[i].bpm = bpm;
  trackAudioManager.songBufferInfo[i].beat_list = beat_list;
  // GET the song from the backend python server
  xhr.open('GET', 'http://localhost:8000/song-content?songName=' + songName, true);
  xhr.responseType = 'arraybuffer';
  xhr.onload = function () {
    // debugger;
    audioCtx.decodeAudioData(xhr.response).then(
      audioBuffer => {
        trackAudioManager.setTrackBuffer(i, audioBuffer);
        trackAudioManager.songBufferInfo[i].waveFormData = getWaveformData(audioBuffer, beat_list.length);
        var yMax = d3.max(trackAudioManager.songBufferInfo[i].waveFormData);
        for(var j = 0; j< beat_list.length; j++){
          trackAudioManager.songBufferInfo[i].waveFormData[j] = trackAudioManager.songBufferInfo[i].waveFormData[j]*70/yMax; // 0.175 is asumed peak wave, should be yMax
        };

        // console.log('listlength: ',i,  beat_list.length);
        // console.log('duration: ', i, audioBuffer.duration);
        // console.log('yMax: ',i, yMax);
        // console.log('yWave: ',i, trackAudioManager.songBufferInfo[i].waveFormData);
        if (trackAudioManager.songBufferInfo[i].beat_list != null) {
           TrackCanvasInterface.initialRender(
             trackAudioManager.songBufferInfo[0].trackName,
             trackAudioManager.songBufferInfo[0].bpm,
             trackAudioManager.songBufferInfo[0].beat_list,
             trackAudioManager.songBufferInfo[0].waveFormData,
             trackAudioManager.songBufferInfo[0].duration,
             trackAudioManager.songBufferInfo[1].trackName,
             trackAudioManager.songBufferInfo[1].bpm,
             trackAudioManager.songBufferInfo[1].beat_list,
             trackAudioManager.songBufferInfo[1].waveFormData,
             trackAudioManager.songBufferInfo[1].duration,
           );
        }
      }
    )
  };
  console.log('Loading backend track - 02');
  xhr.send();
}

const avg = values => values.reduce((sum, value) => sum + value, 0) / values.length;

function getWaveformData(audioBuffer, dataPoints) {
  const leftChannel = audioBuffer.getChannelData(0);
  const rightChannel = audioBuffer.getChannelData(1);
  const values = new Float32Array(dataPoints);
  const dataWindow = Math.round(leftChannel.length / dataPoints);
  for (let i = 0, y = 0, buffer = []; i < leftChannel.length; i++) {
    const summedValue = (Math.abs(leftChannel[i]) + Math.abs(rightChannel[i])) / 2;
    buffer.push(summedValue);
    if (buffer.length === dataWindow) {
      values[y++] = avg(buffer);
      buffer = [];
    }
  }
  return values;
}
