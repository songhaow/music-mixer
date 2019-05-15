// todo: don't export audioCtx directly
import {audioCtx, TrackAudioManager} from '/static/js/audio_logic/audio_context_logic.js';
import {TrackCanvasInterface} from '/static/js/view/track_canvas/main_render.js';

export const AudioSourceInterface = {
  loadBackendTrack(i, trackAudioManager, songName) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'http://localhost:8080/song-content?songName=' + songName, true);
  xhr.responseType = 'arraybuffer';
  xhr.onload = function () {

    audioCtx.decodeAudioData(xhr.response).then(
      audioBuffer => {
        trackAudioManager.setTrackBuffer(i, audioBuffer);

        var beatNdTempo = beatsAndTempo(audioBuffer);
        trackAudioManager.songBufferInfo[i].bpm = beatNdTempo.tempo; // beeat per minute
        trackAudioManager.songBufferInfo[i].beat_list = beatNdTempo.beats; // in seconds
        trackAudioManager.songBufferInfo[i].duration = d3.max(beatNdTempo.beats); // in seconds

        var waveData = getWaveformData(audioBuffer, beatNdTempo.beats.length);
        trackAudioManager.songBufferInfo[i].waveFormData = waveData; // wave amplitude distribution in time

        var yMax = d3.max(trackAudioManager.songBufferInfo[i].waveFormData); // scale wave amplitude to the disply blocks
        for(var j = 0; j< beatNdTempo.beats.length; j++){
          trackAudioManager.songBufferInfo[i].waveFormData[j] = trackAudioManager.songBufferInfo[i].waveFormData[j]*70/yMax;
        };

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
  console.log('Loading backend track: ', i);
  xhr.send();
}
}


function beatsAndTempo(audioBuffer, beatsNdTempo){ // music-tempo.min.js
  var audioData = [];
  if (audioBuffer.numberOfChannels == 2) {
     var leftchannel = audioBuffer.getChannelData(0);
     var rightchannel = audioBuffer.getChannelData(1);
     for (var j = 0; j < leftchannel.length; j++) {
       audioData[j] = (leftchannel[j] + rightchannel[j]) / 2;
     }
    } else {
   audioData = buffer.getChannelData(0);
    }
  beatsNdTempo = new MusicTempo(audioData);
  return beatsNdTempo;
}

// https://gist.github.com/bodyflex/e4f6c9ec0fdea9450fd9303dd088b96d
const avg = values => values.reduce((sum, value) => sum + value, 0) / values.length;
function getWaveformData(audioBuffer, dataPoints) {
  var leftChannel = audioBuffer.getChannelData(0);
  var rightChannel = audioBuffer.getChannelData(1);
  var values = new Float32Array(dataPoints);
  var dataWindow = Math.round(leftChannel.length / dataPoints);
  for (let i = 0, y = 0, buffer = []; i < leftChannel.length; i++) {
    var summedValue = (Math.abs(leftChannel[i]) + Math.abs(rightChannel[i])) / 2;
    buffer.push(summedValue);
    if (buffer.length === dataWindow) {
      values[y++] = avg(buffer);
      buffer = [];
    }
  }
  return values;
}
