// todo: don't export audioCtx directly
import {audioCtx, TrackAudioManager} from '/static/js/audio_logic/audio_context_logic.js';

export const AudioSourceInterface = {
  loadBackendTrack(trackAudioManager, songName) {
    var xhr = new XMLHttpRequest();

    // GET the song from the backend python server
    xhr.open('GET', 'http://localhost:8080/song?songName=' + songName, true);

    xhr.responseType = 'arraybuffer';
    xhr.onload = function () {
      console.log('> backend track loaded, decoding...');
      audioCtx.decodeAudioData(xhr.response).then(
        audioBuffer => {
          // setTrackBuffer function by passing in the songName so that we know what song to set the
          // audioBuffer for.
          trackAudioManager.setTrackBuffer(songName, audioBuffer);
          console.log('> backend track decoded and buffer set');
        }
      )
    };
    console.log('Loading backend track...');
    xhr.send();
  }
};
