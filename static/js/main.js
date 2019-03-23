// Import commands allow us to import functions and modules from other
// javascript files -- like we do in python
import {TrackAudioManager}    from '/static/js/audio_logic/audio_context_logic.js';
import {AudioSourceInterface} from '/static/js/api/audio_source.js';
import {TrackCanvasInterface} from '/static/js/view/track_canvas/main_render.js';
import {PositionObj} from '/static/js/view/track_canvas/main_render.js';

/**
 * Here we create an instance of the class TrackAudioManager.  The track
 * audio manager will keep the tracks that we want to play and expose
 * the functions to play, stop, and seek the track position.
 */
var trackAudioManager = new TrackAudioManager();

// 17. You can now delete this variable since it is no longer used.
var track1FileName = '02-SW-062018.mp3';
// 19. You can do the same for track2 filename as you did for track1 filename.
// Once you are complete, try to see if the program runs correctly. If it
// is broken, let me know if anything is broken. 
var track2FileName = '07-Littlewhiteboat.mp3';

document.getElementById("fname01").onchange = function(event) {
    // 18. You should change this to a different variable name (fileName)
    // since it does not relate to track1FileName directly anymore
    track1FileName = event.target.value;
    var split = track1FileName.split('\\');
    var length1 = split.length-1;
    track1FileName = split[length1];

    // 9. Here, we are at the function that's called when you select
    // a new file. We want to first load the track from the backend,
    // so you need to call loadBackendTrack from AudioSourceInterface.

    // 10. The load operation will be asynchronous (I can explain that
    // more in person) so while it's happening, we can tell
    // trackAudioManager to update the name of track1 by using
    // functions we wrote in step 8.


    // 11. Since track1 filename is now saved in trackAudioManager, we
    // can use it here instead of track1FileName. In the 2 lines below,
    // replace track1FileName with trackAudioManager.track1Name
    console.log('File name 1: ', track1FileName);
    TrackCanvasInterface.initialRender(track1FileName,track2FileName);
  }

document.getElementById("fname02").onchange = function(event) {
      track2FileName = event.target.value;
      var split = track2FileName.split("\\");
      var length2 = split.length-1;
      track2FileName = split[length2];
      console.log('File name 2: ', track2FileName);

      // 12. same thing as step 11 here
      TrackCanvasInterface.initialRender(track1FileName,track2FileName);
  }

// When the user presses the play / stop button, we tell the
// trackAudioManager instance what to do.
document.querySelector('#play1Button').onclick = function() {
  // 5. After the new Track1 song is loaded, you press the play button
  // but it does not work correctly, because we are not calling
  // playTrack() function with the right name. We use track1FileName
  // here which (on line 15) is always the same file.
  // We need to have the file name changed to the new file name that
  // we have loaded. We want to change track1FileName at the same time
  // as we are saving the music into the trachAudioManager.
  trackAudioManager.playTrack(track1FileName, PositionObj.play1X);
  // 13. same thing as step 11 in the line above
  console.log('Mainplay1X: ', PositionObj.play1X);
 };

document.querySelector('#pause1Button').onclick = function() {
  // 14. same thing as step 11 here
  trackAudioManager.stopTrack(track1FileName);
};

document.querySelector('#play2Button').onclick = function() {
  var PlayOffset = PositionObj.play2X;
  if ( PlayOffset< 0){
    PlayOffset = 0;
  }
  trackAudioManager.playTrack(track2FileName, PlayOffset);
  console.log('Mainplay2X: ', PlayOffset);
  };

document.querySelector('#pause2Button').onclick = function() {
  trackAudioManager.stopTrack(track2FileName);
};

document.querySelector('#playMixButton').onclick = function() {
  // 15. same thing as step 11 here
  trackAudioManager.playMixTrack(track1FileName,0,PositionObj.play1X);
  var waitTrack2 = 1000*PositionObj.play1X;
  setTimeout(playTrack2, waitTrack2);
  function playTrack2(){
    trackAudioManager.playTrack(track2FileName,PositionObj.play2X);
  }
};

document.querySelector('#pauseMixButton').onclick = function() {
  // 16. same thing as step 11 here
  trackAudioManager.stopTrack(track1FileName);
  trackAudioManager.stopTrack(track2FileName);
}

/**
 * Here, we make a call to the python flask server to get the track
 * audio information.  Once the audio information comes back and is
 * decoded, we load it into track1.  We pass it the trackAudioManager
 * because that's the track manager object we want to load the audio
 * information into.
 */
AudioSourceInterface.loadBackendTrack(trackAudioManager, track1FileName);
AudioSourceInterface.loadBackendTrack(trackAudioManager, track2FileName);
/**
 * Here we make a call to render the initial track canvas and set up the
 * UI interface
 */
TrackCanvasInterface.initialRender(track1FileName,track2FileName);
