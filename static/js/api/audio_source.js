// todo: don't export audioCtx directly
import {audioCtx, TrackAudioManager} from '/static/js/audio_logic/audio_context_logic.js';


// AudioSourceInterface.loadBackendTrack(trackAudioManager, trackAudioManager.track2Name);


export const AudioSourceInterface = {
  /**
   * We break this "loadBackendTrack" call into two separate requests. The
   * first request, we get the song meta information. The second request,
   * we get the actual song content.
   */
  loadBackendTrack(i, trackAudioManager, songName) {
    var xhr = new XMLHttpRequest();

    // GET the song from the backend python server
    xhr.open('GET', 'http://localhost:8080/song-meta?songName=' + songName, true);

    // responseType tells javascript how to format the response data from
    // our python backend. It used to be arraybuffer because all we were
    // getting was long sequence of data representing the music. Having
    // it comes out as a simple array of ints was easy to use. Now we
    // have complicated json info with bpm, song_content, etc, so we want
    // to tell javascript to format the backend response data as a json
    // object.
    xhr.responseType = 'json';
    xhr.onload = function () {
      debugger;
      fetchAndLoadSongContent(
        i,
        trackAudioManager,
        songName,
        xhr.response.beat_list,
        xhr.response.bpm,
      );
    };
    console.log('Loading backend track...');
    xhr.send();
  }
};


function fetchAndLoadSongContent(i, trackAudioManager, songName, beatList, bpm) {
  var xhr = new XMLHttpRequest();

  // GET the song from the backend python server
  xhr.open('GET', 'http://localhost:8080/song-content?songName=' + songName, true);

  xhr.responseType = 'arraybuffer';
  xhr.onload = function () {

    // console.log('> backend track loaded, decoding...');
    audioCtx.decodeAudioData(xhr.response).then(
      audioBuffer => {
        // setTrackBuffer function by passing in the songName so that we know what song to set the
        // audioBuffer for.
        trackAudioManager.setTrackBuffer(i, audioBuffer);

        // console.log('songName for buffer: ', songName);
        console.log('> backend track decoded and buffer set');
      }
    )
  };
  console.log('Loading backend track...');
  xhr.send();
}
