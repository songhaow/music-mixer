// Import commands allow us to import functions and modules from other
// javascript files -- like we do in python
import {AudioSourceInterface} from '/static/js/api/audio_source.js';
import {TrackAudioManager}    from '/static/js/audio_logic/audio_context_logic.js';
import {TrackCanvasInterface} from '/static/js/view/track_canvas/main_render.js';

/**
 * Here we create an instance of the class TrackAudioManager.  The track
 * audio manager will keep the tracks that we want to play and expose
 * the functions to play, stop, and seek the track position.
 */
var trackAudioManager = new TrackAudioManager();

// When the user presses the play / stop button, we tell the
// trackAudioManager instance what to do.
document.querySelector('#play1Button').onclick = function() {
  // NOTE: we have hardcoded only one song in the TrackAudioManager. We need to
  // get both songs in there to play them at the same time.
  var track1LengthMS = trackAudioManager.getTrack1LengthMS();
  var playCursorPositionPx = TrackCanvasInterface.getPlayCursorPosPx();
  var track2PosPx = TrackCanvasInterface.getTrack2PosPx();
  var track2LengthPx = TrackCanvasInterface.getTrack2LengthPx();

  var playCursorDeltaPx = playCursorPositionPx - track2PosPx;
  if (playCursorDeltaPx < 0) {
    playCursorDeltaPx = 0;
  }
  var track2PlayOffsetSeconds =
    (playCursorDeltaPx / track2LengthPx) * track1LengthMS / 1000;

  // console.log('offset seconds: ' + track2PlayOffsetSeconds);

  trackAudioManager.playTrack1(track2PlayOffsetSeconds);
};

document.querySelector('#pause1Button').onclick = function() {
  trackAudioManager.stopTrack1();
};

/**
 * Here, we make a call to the python flask server to get the track
 * audio information.  Once the audio information comes back and is
 * decoded, we load it into track1.  We pass it the trackAudioManager
 * because that's the track manager object we want to load the audio
 * information into.
 */
AudioSourceInterface.loadBackendTrack(trackAudioManager);

/**
 * Here we make a call to render the initial track canvas and set up the
 * UI interface
 */
TrackCanvasInterface.initialRender();
