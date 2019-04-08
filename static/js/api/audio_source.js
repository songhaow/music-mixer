// todo: don't export audioCtx directly
import {audioCtx, TrackAudioManager} from '/static/js/audio_logic/audio_context_logic.js';


// AudioSourceInterface.loadBackendTrack(trackAudioManager, trackAudioManager.track2Name);

export const AudioSourceInterface = {
    loadBackendTrack(i, trackAudioManager, songName) {
    var xhr = new XMLHttpRequest();

    // GET the song from the backend python server
    xhr.open('GET', 'http://localhost:8080/song?songName=' + songName, true);

    xhr.responseType = 'arraybuffer';
    xhr.onload = function () {

      // BEFORE we were returning "content" variable which had song info
      xhr.response = 'abc...xyz'

      // NOW we are returning dictionary information
      xhr.response = {
        "beat_file": beat_key,
        "beat_list": beats,
        "bpm": bpm,
        "song_content": 'abc...xyz',
      }


      // console.log('> backend track loaded, decoding...');
      audioCtx.decodeAudioData(xhr.response.song_content).then(
        audioBuffer => {
          // setTrackBuffer function by passing in the songName so that we know what song to set the
          // audioBuffer for.
          trackAudioManager.setTrackBuffer(i, audioBuffer);

          trackAudioManager.setBeatInformation(i, beat_file, beat_list, bpm);


          // console.log('songName for buffer: ', songName);
          console.log('> backend track decoded and buffer set');
        }
      )
    };
    console.log('Loading backend track...');
    xhr.send();
  }
};
