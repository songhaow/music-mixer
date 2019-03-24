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

document.getElementById("fname01").onchange = function(event) {
    var tempFileName = event.target.value;
    var split = tempFileName.split('\\');
    var length1 = split.length-1;
    tempFileName = split[length1];
    trackAudioManager.setTrack1Name(tempFileName);
    AudioSourceInterface.loadBackendTrack(trackAudioManager, trackAudioManager.track1Name);
    TrackCanvasInterface.initialRender(trackAudioManager.track1Name,trackAudioManager.track2Name);
    console.log('File name 1: ', tempFileName);
    console.log('File name 1: ', trackAudioManager.track1Name);
    console.log('File name 2: ', trackAudioManager.track2Name);
  }

document.getElementById("fname02").onchange = function(event) {
      var tempFileName = event.target.value;
      var split = tempFileName.split("\\");
      var length2 = split.length-1;
      tempFileName = split[length2];
      trackAudioManager.setTrack2Name(tempFileName);
      AudioSourceInterface.loadBackendTrack(trackAudioManager, trackAudioManager.track2Name);
      TrackCanvasInterface.initialRender(trackAudioManager.track1Name,trackAudioManager.track2Name);
      console.log('File name 2: ', tempFileName);
      console.log('File name 2: ', trackAudioManager.track2Name);
      console.log('File name 1: ', trackAudioManager.track1Name);
  }

// When the user presses the play / stop button, we tell the
// trackAudioManager instance what to do.
document.querySelector('#play1Button').onclick = function() {
  trackAudioManager.playTrack(trackAudioManager.track1Name, PositionObj.play1X);
  // console.log('Mainplay1X: ', PositionObj.play1X);
 };

document.querySelector('#pause1Button').onclick = function() {
   trackAudioManager.stopTrack(trackAudioManager.track1Name);
 };

document.querySelector('#play2Button').onclick = function() {
  var PlayOffset = PositionObj.play2X;
  if ( PlayOffset< 0){
    PlayOffset = 0;
  }
  trackAudioManager.playTrack(trackAudioManager.track2Name, PlayOffset);
  // console.log('Mainplay2X: ', PlayOffset);
  };

document.querySelector('#pause2Button').onclick = function() {
  trackAudioManager.stopTrack(trackAudioManager.track2Name);
};

document.querySelector('#playMixButton').onclick = function() {
  trackAudioManager.playMixTrack(trackAudioManager.track1Name,0,PositionObj.play1X);
  var waitTrack2 = 1000*PositionObj.play1X;
  setTimeout(playTrack2, waitTrack2);
  function playTrack2(){
    trackAudioManager.playTrack(trackAudioManager.track2Name,PositionObj.play2X);
  }
};

document.querySelector('#pauseMixButton').onclick = function() {
  trackAudioManager.stopTrack(trackAudioManager.track1Name);
  trackAudioManager.stopTrack(trackAudioManager.track2Name);
}

/**
 * Here, we make a call to the python flask server to get the track
 * audio information.  Once the audio information comes back and is
 * decoded, we load it into track1.  We pass it the trackAudioManager
 * because that's the track manager object we want to load the audio
 * information into.
 */
AudioSourceInterface.loadBackendTrack(trackAudioManager, trackAudioManager.track1Name);
AudioSourceInterface.loadBackendTrack(trackAudioManager, trackAudioManager.track2Name);
/**
 * Here we make a call to render the initial track canvas and set up the
 * UI interface
 */
TrackCanvasInterface.initialRender(trackAudioManager.track1Name,trackAudioManager.track2Name);
