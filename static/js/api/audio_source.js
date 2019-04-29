// todo: don't export audioCtx directly
import {audioCtx, TrackAudioManager} from '/static/js/audio_logic/audio_context_logic.js';

// AudioSourceInterface.loadBackendTrack(trackAudioManager, trackAudioManager.track2Name);
// var sitename = 'http://localhost:8080/song-meta?songName=';

export const AudioSourceInterface = {

  loadBackendTrack(i, trackAudioManager, songName) {
    // var songName = trackAudioManager.songBufferInfo[i].trackName;
    console.log('songName in loadBackendTrack: ', songName);
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
    trackAudioManager.songBufferInfo[i].bpm = bpm;
    trackAudioManager.songBufferInfo[i].beat_list = beat_list;
    // GET the song from the backend python server
    xhr.open('GET', 'http://localhost:8000/song-content?songName=' + songName, true);
    xhr.responseType = 'arraybuffer';
    xhr.onload = function () {
    audioCtx.decodeAudioData(xhr.response).then(
      audioBuffer => {
        trackAudioManager.setTrackBuffer(i, audioBuffer);
        console.log('> backend track decoded and buffer set');
      }
    )
  };
  console.log('Loading backend track - 02');
  xhr.send();
}
