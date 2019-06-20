import {TrackAudioManager} from '/static/js/audio_logic/audio_context_logic.js';
import {AudioSourceInterface} from '/static/js/api/audio_source.js';
import {PositionObj} from '/static/js/view/track_canvas/main_render.js';
import {audioCtx} from '/static/js/audio_logic/audio_context_logic.js';
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

document.getElementById("fname01").onchange = function(e) {
  tempFileName = e.target.value;
  tempFileName = seperateFileName();
  trackAudioManager.setTrackName(0, tempFileName);
  AudioSourceInterface.loadBackendTrack(0, trackAudioManager,tempFileName);
}

document.getElementById("fname02").onchange = function(e) {
  tempFileName = e.target.value;
  tempFileName = seperateFileName();
  PositionObj.track2Start = 0.0;
  trackAudioManager.setTrackName(1, tempFileName);
  AudioSourceInterface.loadBackendTrack(1, trackAudioManager,tempFileName);
}

// When the user presses the play / stop button, we tell the
// referencedfrom https://codepen.io/superpikar/pen/zJsgH

var state1 = 'stop';
document.querySelector('#button_play1').onclick = function() {
    if(state1 == 'stop'){
      state1 ='play';
      var button = d3.select("#button_play1").classed('btn-success', true);
      button.select("i").attr('class', "fa fa-pause");
      trackAudioManager.playTrack(0, PositionObj.play1X);
      var currentTime = audioCtx.currentTime;
      updateAudioPosition(); // call for frequency animation
      PositionObj.currentPlayCursorX = 0;
    }
    else if(state1=='play' || state1=='resume'){
      state1 = 'pause';
      d3.select("#button_play1 i").attr('class', "fa fa-play");
      trackAudioManager.stopTrack(0);
    }
    else if(state1=='pause'){
      state1 = 'resume';
      d3.select("#button_play1 i").attr('class', "fa fa-pause");
      trackAudioManager.playTrack(0, PositionObj.play1X);
      updateAudioPosition(); // call for frequency animation
    }
}
document.querySelector('#button_stop1').onclick =function(){
    state1 = 'stop';
    var button = d3.select("#button_play1").classed('btn-success', false);
    button.select("i").attr('class', "fa fa-play");
    trackAudioManager.stopTrack(0);
}

var state2 = 'stop';
document.querySelector('#button_play2').onclick = function() {
    if(state2 == 'stop'){
      state2 ='play';
      var button = d3.select("#button_play2").classed('btn-success', true);
      button.select("i").attr('class', "fa fa-pause");
      var PlayOffset = PositionObj.play2X;
         if (PlayOffset< 0){
            PlayOffset = 0;
         }
         trackAudioManager.playTrack(1, PlayOffset);
    }
    else if(state2=='play' || state2=='resume'){
      state2 = 'pause';
      d3.select("#button_play2 i").attr('class', "fa fa-play");
      trackAudioManager.stopTrack(1);
    }
    else if(state2=='pause'){
      state2 = 'resume';
      d3.select("#button_play2 i").attr('class', "fa fa-pause");
      var PlayOffset = PositionObj.play2X;
         if (PlayOffset< 0){
            PlayOffset = 0;
         }
         trackAudioManager.playTrack(1, PlayOffset);
    }
}
document.querySelector('#button_stop2').onclick =function(){
    state2 = 'stop';
    var button = d3.select("#button_play2").classed('btn-success', false);
    button.select("i").attr('class', "fa fa-play");
    trackAudioManager.stopTrack(1);
    // PositionObj.play2X = 0;
}

var stateM = 'stop';
document.querySelector('#button_playM').onclick = function () {
      if(stateM == 'stop'){
        stateM = 'play';
        var button = d3.select("#button_playM").classed('btn-success', true);
        button.select("i").attr('class', "fa fa-pause");
        trackAudioManager.playMixTrack(0, PositionObj.play1X);
        var waitTrack2 = 1000*PositionObj.play1X;
        setTimeout(playTrack2, waitTrack2);
        function playTrack2(){
          trackAudioManager.playTrack(1, PositionObj.play2X);
        }
      }
      else if(stateM=='play' || stateM=='resume'){
        stateM = 'pause';
        d3.select("#button_playM i").attr('class', "fa fa-play");
        trackAudioManager.stopTrack(0);
        trackAudioManager.stopTrack(1);
      }
      else if(stateM=='pause'){
        stateM = 'resume';
        d3.select("#button_playM i").attr('class', "fa fa-pause");
      }
}
document.querySelector('#button_stopM').onclick =function(){
    stateM = 'stop';
    var button = d3.select("#button_playM").classed('btn-success', false);
    button.select("i").attr('class', "fa fa-play");
    trackAudioManager.stopTrack(0);
    trackAudioManager.stopTrack(1);
    // PositionObj.play2X = 0;
}

document.querySelector('#volumeControl').onclick = function(element){ //Reference: webaudio-learn/webaudio-Volume-Control.html
      var volume = element.target.value;
      var fraction = parseInt(volume) / parseInt(element.target.max);
      // use x*x curve (x-squared) since simple linear (x) does not sound as good.
      console.log('gainNode: ', trackAudioManager.gainNode);
      trackAudioManager.gainNode.gain.value = fraction * fraction;
      console.log('Volume: ', trackAudioManager.gainNode.gain.value);
};

function updateAudioPosition() {
    var currentTime = audioCtx.currentTime;
    var duration = trackAudioManager.songBufferInfo[0].duration;
    PositionObj.currentPlayCursorX = PositionObj.track1Start + currentTime / duration * 1300;
    // PositionObj.currentPlayCursorX = (audioCtx.currentTime-currentTime)/ duration * 1300;
    d3.select("#playCursorRect01").attr('x', PositionObj.currentPlayCursorX);
    requestAnimationFrame(updateAudioPosition);
 }

function seperateFileName(){
  split = tempFileName.split('\\');
  splitLength = split.length-1;
  tempFileName = split[splitLength]; // filename.mp3
  return tempFileName;
}
