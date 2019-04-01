// todo: don't export audioCtx directly
import {audioCtx, TrackAudioManager} from '/static/js/audio_logic/audio_context_logic.js';


// AudioSourceInterface.loadBackendTrack(trackAudioManager, trackAudioManager.track2Name);

export const AudioSourceInterface = {
  loadBackendTrack(i, trackAudioManager, songName) {
    var xhr = new XMLHttpRequest();

    // GET the song from the backend python server
    xhr.open('GET', 'http://localhost:5000/song?songName=' + songName, true);

    xhr.responseType = 'arraybuffer';
    xhr.onload = function () {
      // console.log('> backend track loaded, decoding...');
      audioCtx.decodeAudioData(xhr.response).then(
        audioBuffer => {
          // setTrackBuffer function by passing in the songName so that we know what song to set the
          // audioBuffer for.
          trackAudioManager.setTrackBuffer(i, songName, audioBuffer);
          // console.log('songName for buffer: ', songName);
          console.log('> backend track decoded and buffer set');
        }
      )
    };
    console.log('audioCtx...', audioCtx);
    console.log('Loading backend track...');
    xhr.send();
  }
};
