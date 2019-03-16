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

var track1FileName = '02-SW-062018.mp3';
var track2FileName = '07-Littlewhiteboat.mp3';
// var track3FileName = '01-04-2017.mp3';

document.getElementById("fname01").onchange = function(event) {
    track1FileName = event.target.value;
    var split = track1FileName.split('\\');
    var length1 = split.length-1;
    track1FileName = split[length1];
    console.log('File name 1: ', track1FileName);
    // AudioSourceInterface.loadBackendTrack(trackAudioManager, track1FileName);
    TrackCanvasInterface.initialRender(track1FileName,track2FileName);
  }

document.getElementById("fname02").onchange = function(event) {
      track2FileName = event.target.value;
      var split = track2FileName.split("\\");
      var length2 = split.length-1;
      track2FileName = split[length2];
      console.log('File name 2: ', track2FileName);
      // AudioSourceInterface.loadBackendTrack(trackAudioManager, track2FileName);
      TrackCanvasInterface.initialRender(track1FileName,track2FileName);
  }

// When the user presses the play / stop button, we tell the
// trackAudioManager instance what to do.
document.querySelector('#play1Button').onclick = function() {
  trackAudioManager.playTrack(track1FileName, PositionObj.play1X);
  console.log('Mainplay1X: ', PositionObj.play1X);
 };

document.querySelector('#pause1Button').onclick = function() {
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
