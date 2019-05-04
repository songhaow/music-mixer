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
  /** ### README BEGIN ###
   *
   * This is where I will start explaining the issue.
   *
   * The problem we are trying to solve right now is that we want to
   * stop relying on the .txt files for each song's meta info (like bpm)
   * and begin using the json information we get from the /song-meta
   * python endpoint.
   *
   * We want to achieve the following:
   * 1. Javascript (browser) sends a request to python backend to get
   *    song meta info (bpm, etc)
   * 2. Backend returns song meta
   * 3. Javascript sets song information only AFTER it has received
   *    song meta information. Javascript then updates the User
   *    Interface once the information is set.
   *
   * What is happening in this function right now:
   * - We set the song name (by calling trackAudioManager.setTrackName)
   *   before we even ask for song meta
   * - We request the song meta with AudioSourceInterface.loadBackendTrack
   * - We do not wait for anything to come back and we render the UI
   *   again with call to renderOnly. This does not display the 100%
   *   correct info.
   * The one other thing that we need to fix is that the renderOnly()
   * call takes the song name and looks up the .txt file with a special
   * d3.json function. We need to replace that logic by referencing the
   * updated information TrackAudioManager.songBufferInfo.
   *
   * I will make a few comments below (and in other files) on what you
   * need to do (high level). See if you can get it to work. If any
   * problems, we can solve together tomorrow night.
   */
  tempFileName = e.target.value;
  tempFileName = seperateFileName();
  // todo: remove setTrackName call -- we will set the name when we get
  // the song meta info
  trackAudioManager.setTrackName(0, tempFileName);
  AudioSourceInterface.loadBackendTrack(0, trackAudioManager, tempFileName);
  console.log('name-main-2: ',trackAudioManager.songBufferInfo[0].trackName);
  console.log('bpm-main-2: ',trackAudioManager.songBufferInfo[0].bpm);
  // todo: remove renderOnly call -- we will call this in loadBackendTrack
  // when we have received songMeta info
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
  trackAudioManager.frequencyDemo(0);
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
  // todo: initialRender does not need the trackName information to be
  // passed anymore. That was used to get the txt file that we don't
  // need anymore
  trackname01 = trackAudioManager.songBufferInfo[0].trackName;
  trackname02 = trackAudioManager.songBufferInfo[1].trackName;
  TrackCanvasInterface.initialRender(trackname01,trackname02);
}
