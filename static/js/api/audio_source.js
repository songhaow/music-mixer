// todo: don't export audioCtx directly
import {audioCtx, TrackAudioManager} from '/static/js/audio_logic/audio_context_logic.js';

// I will trace through the code with comments for you so you can see what
// you need to fix for the error that happens when you load a new song
// with the load "Load track01" button and then
//
export const AudioSourceInterface = {
  // 1. After you select the song, this function should be called to
  // fetch song info from the backend. Without song info, you cannot
  // play the music.
  loadBackendTrack(trackAudioManager, songName) {
    var xhr = new XMLHttpRequest();

    // GET the song from the backend python server
    xhr.open('GET', 'http://localhost:8000/song?songName=' + songName, true);

    xhr.responseType = 'arraybuffer';
    xhr.onload = function () {
      console.log('> backend track loaded, decoding...');
      audioCtx.decodeAudioData(xhr.response).then(
        audioBuffer => {
          // setTrackBuffer function by passing in the songName so that we know what song to set the
          // audioBuffer for.

          // 2. Once the song is loaded from the backend, we set it's name
          // and other information into the "track audio manager" which is
          // an instance of TrackAudioManager. We call setTrackBuffer.
          trackAudioManager.setTrackBuffer(songName, audioBuffer);

          // 6. As mentioned in step 5, we should update the track1FileName
          // after we set the song into the track audio manager, so we can
          // naturally do it here. The problem is that track1FileName
          // variable is defined in main.js and not here. There are 2
          // solutions:
          // 1) Check that track1FileName variable is available here and
          //   update it. Variables that are not declared inside of a function
          //   have global scope so if you can print out track1FileName here,
          //   then you can update it.
          //   - You can update track1FileName here and see if it works.
          // 2) Change track1FileName to be an attribute of TrackAudioManager
          //   instead of a separate variable defined somewhere. A way of
          //   thinking about this is as follows:
          //   - If we pretend that our instance of TrackAudioManager is a
          //     person, then we know that he currently helps us remember
          //     what songs we have loaded via his songBufferInfo storage.
          //   - Right now, we keep the names of the 2 songs we want to
          //     play written in main.js, which we track ourselves. When
          //     we want to play track 1, we get the name (track1FileName) and
          //     we tell the trackAudioManager person to play a song with that
          //     name.
          //   - Instead, we can tell trackAudioManager to begin keeping the
          //     names of track1 and track2. Then, when we want to play track1,
          //     we tell trackAudioManager to play track1 and he will know
          //     what song name to look up.
          // Option (2) is the correct way to do this so step 7 will assume we
          // are moving song name tracking into TrackAudioManager.
          console.log('> backend track decoded and buffer set');
        }
      )
    };
    console.log('audioCtx...', audioCtx);
    console.log('Loading backend track...');
    xhr.send();
  }
};
