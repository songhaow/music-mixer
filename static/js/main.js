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
var tempFileName, split, splitLength;

AudioSourceInterface.loadBackendTrack(0,trackAudioManager, trackAudioManager.songBufferInfo[0].trackName);
AudioSourceInterface.loadBackendTrack(1,trackAudioManager, trackAudioManager.songBufferInfo[1].trackName);
TrackCanvasInterface.initialRender(trackAudioManager.songBufferInfo[0].trackName,trackAudioManager.songBufferInfo[1].trackName);

document.getElementById("fname01").onchange = function(event) {
  tempFileName = event.target.value;
  split = tempFileName.split('\\');
  splitLength = split.length-1;
  tempFileName = split[splitLength];
  trackAudioManager.setTrackName(0, tempFileName);
  AudioSourceInterface.loadBackendTrack(0, trackAudioManager, trackAudioManager.songBufferInfo[0].trackName);
  TrackCanvasInterface.initialRender(trackAudioManager.songBufferInfo[0].trackName,trackAudioManager.songBufferInfo[1].trackName);
}

document.getElementById("fname02").onchange = function(event) {
  tempFileName = event.target.value;
  split = tempFileName.split("\\");
  splitLength = split.length-1;
  tempFileName = split[splitLength];
  PositionObj.track2Start = 0.0;
  trackAudioManager.setTrackName(1, tempFileName);
  AudioSourceInterface.loadBackendTrack(1, trackAudioManager, trackAudioManager.songBufferInfo[1].trackName);
  TrackCanvasInterface.initialRender(trackAudioManager.songBufferInfo[0].trackName,trackAudioManager.songBufferInfo[1].trackName);
}

// NOTE: I have made a variable for track1 file name so we can always reference
// it consistently
var track1FileName = 'eyes.m4a';
// same thing for track2
var track1FileName = '07-Littlewhiteboat.mp3';

// When the user presses the play / stop button, we tell the
// trackAudioManager instance what to do.
document.querySelector('#play1Button').onclick = function() {
  trackAudioManager.playTrack(0, PositionObj.play1X);
 };


document.querySelector('#pause1Button').onclick = function() {
   trackAudioManager.stopTrack(0);
};

document.querySelector('#play2Button').onclick = function() {
   var PlayOffset = PositionObj.play2X;
   if (PlayOffset< 0){
     PlayOffset = 0;
  }
  trackAudioManager.playTrack(1, PlayOffset);
};

document.querySelector('#pause2Button').onclick = function() {
  trackAudioManager.stopTrack(1);
};

document.querySelector('#playMixButton').onclick = function() {
  trackAudioManager.playMixTrack(0, PositionObj.play1X);
  var waitTrack2 = 1000*PositionObj.play1X;
  setTimeout(playTrack2, waitTrack2);
  function playTrack2(){
    trackAudioManager.playTrack(1, PositionObj.play2X);
  }
};

document.querySelector('#pauseMixButton').onclick = function() {
  trackAudioManager.stopTrack(0);
  trackAudioManager.stopTrack(1);
}

/**
 * Here, we make a call to the python flask server to get the track
 * audio information.  Once the audio information comes back and is
 * decoded, we load it into track1.  We pass it the trackAudioManager
 * because that's the track manager object we want to load the audio
 * information into.
 */
// AudioSourceInterface.loadBackendTrack(0, trackAudioManager, trackAudioManager.songBufferInfo[0].trackName);
// AudioSourceInterface.loadBackendTrack(1, trackAudioManager, trackAudioManager.songBufferInfo[1].trackName);
/**
 * Here we make a call to render the initial track canvas and set up the
 * UI interface
 */
// TrackCanvasInterface.initialRender(trackAudioManager.songBufferInfo[0].trackName,trackAudioManager.songBufferInfo[1].trackName);
