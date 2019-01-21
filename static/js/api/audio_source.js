// todo: don't export audioCtx directly
import {audioCtx, TrackAudioManager} from '/static/js/audio_logic/audio_context_logic.js';

export const AudioSourceInterface = {
  loadBackendTrack (trackAudioManager) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://localhost:8080/song', true);
    xhr.responseType = 'arraybuffer';
    xhr.onload = function () {
      console.log('> backend track loaded, decoding...');
      audioCtx.decodeAudioData(xhr.response).then(
        audioBuffer => {
          trackAudioManager.setTrackBuffer1(audioBuffer);
          console.log('> backend track decoded and buffer set');
        }
      )
    };
    console.log('Loading backend track...');
    xhr.send();
  }
};
