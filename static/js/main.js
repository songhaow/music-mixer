import {TrackAudioManager} from '/static/js/audio_logic/audio_context_logic.js';
import {AudioSourceInterface} from '/static/js/api/audio_source.js';
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
      updateAudioPosition(); // call for frequency animation
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
         updateAudioPosition();
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
         updateAudioPosition();
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


 function updateAudioPosition() {/////
   // const {currentTime, duration} = audio;
   // const physicalPosition = currentTime / duration * width;
   // if (physicalPosition) {
   //   progress.setAttribute('width', physicalPosition);
   //   remaining.setAttribute('x', physicalPosition);
   //   remaining.setAttribute('width', width - physicalPosition);
   // }
   requestAnimationFrame(updateAudioPosition);/////
 }

function seperateFileName(){
  split = tempFileName.split('\\');
  splitLength = split.length-1;
  tempFileName = split[splitLength]; // filename.mp3
  return tempFileName;
}
