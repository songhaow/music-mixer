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
var tempFileName, split, splitLength, trackname01, trackname02;

trackname01 = trackAudioManager.songBufferInfo[0].trackName;
trackname02 = trackAudioManager.songBufferInfo[1].trackName;
AudioSourceInterface.loadBackendTrack(0,trackAudioManager, trackname01);
AudioSourceInterface.loadBackendTrack(1,trackAudioManager, trackname02);
console.log('name-main-0: ',trackAudioManager.songBufferInfo[0].trackName);
console.log('bpm-main-0: ',trackAudioManager.songBufferInfo[0].bpm);
console.log('beat_list-main-0: ',trackAudioManager.songBufferInfo[0].beat_list);
renderOnly();

document.getElementById("fname01").onchange = function(e) {
  tempFileName = e.target.value;
  tempFileName = seperateFileName();
  trackAudioManager.setTrackName(0, tempFileName);
  AudioSourceInterface.loadBackendTrack(0, trackAudioManager, tempFileName);
  console.log('name-main-2: ',trackAudioManager.songBufferInfo[0].trackName);
  console.log('bpm-main-2: ',trackAudioManager.songBufferInfo[0].bpm);
  console.log('beat_list-main-2: ',trackAudioManager.songBufferInfo[0].beat_list);
  renderOnly();
}

document.getElementById("fname02").onchange = function(e) {
  tempFileName = e.target.value;
  tempFileName = seperateFileName();
  PositionObj.track2Start = 0.0;
  trackAudioManager.setTrackName(1, tempFileName);
  AudioSourceInterface.loadBackendTrack(1, trackAudioManager, tempFileName);
  console.log('name-main-3: ',trackAudioManager.songBufferInfo[1].trackName);
  console.log('bpm-main-3: ',trackAudioManager.songBufferInfo[1].bpm);
  console.log('beat_list-main-3: ',trackAudioManager.songBufferInfo[1].beat_list);
  renderOnly();
}

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

function seperateFileName(){
  split = tempFileName.split('\\');
  splitLength = split.length-1;
  tempFileName = split[splitLength]; // filename.mp3
  return tempFileName;
}

function renderOnly(){
  trackname01 = trackAudioManager.songBufferInfo[0].trackName;
  trackname02 = trackAudioManager.songBufferInfo[1].trackName;
  TrackCanvasInterface.initialRender(trackname01,trackname02);
}
