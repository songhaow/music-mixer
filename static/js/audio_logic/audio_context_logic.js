const AudioContext = window.AudioContext || window.webkitAudioContext;
export const audioCtx = new AudioContext();
// const track1Element = document.querySelector('#track1');
// const trackNode = audioCtx.createMediaElementSource(track1Element);
// trackNode.connect(audioCtx.destination);
var audioSource = null;

//The following are 4 lines to get the dataArray in TimeDomain
//const AudioCtx = window.AudioContext || window.webkitAudioContext;
// var waveAnalyser = audioCtx.CreateAnalyser();
// waveAnalyser.fftSize = 2048;
// waveAnalyser.getByteTimeDomainData(dataArray);

// todo: refactor to track audio manager file
/**
 * The TrackAudioManager is a class that helps us organize each song and its
 * buffer. The buffer is the actual data for the song. This class will have
 * complex logic that manage the data, but will expose some simple functions so
 * we do not have to worry about it most of the time. The class also keeps all
 * logic related to song data management in one place so we can update it
 * easily. This programming principle (hide complexity) is called
 * "encapsulation".
 */

export class TrackAudioManager {
  constructor () {
     this.songBufferInfo = [
         {
           trackName: '01-SW-042017.mp3',
           buffer: null,
           audioSource: null,
           bpm: 95.23,
         },
         {
           trackName: '03-SW-062017.mp3',
           buffer: null,
           audioSource: null,
           bpm: 123.32,
         },
       ];
  }

  // 8. We have to create 2 functions that allow us to change track1 and track2
  //names whenever we want to do so (i.e. when we load a new song)
  setTrackName(i, trackiName) {
    this.songBufferInfo[i].trackName = trackiName;
  }

  setTrackBuffer (i, audioBuffer) {
    var songInfo = this.songBufferInfo[i];
    if (!songInfo) {
      this.songBufferInfo[i] = {};
    }
    this.songBufferInfo[i]['buffer'] = audioBuffer;
  }
  
  _resetTrackSource (i) {
    this.songBufferInfo[i]['audioSource'] = audioCtx.createBufferSource();
    this.songBufferInfo[i]['audioSource'].buffer = this.songBufferInfo[i]['buffer'];
    this.songBufferInfo[i]['audioSource'].connect(audioCtx.destination);
  }

  playTrack (i, playOffsetSec, duration) {
    if (this.songBufferInfo[i]['audioSource'] === null) {
      this._resetTrackSource(i);

    }
    if (typeof(playOffsetSec) === 'undefined') {
      playOffsetSec = 0;
    }
    this.songBufferInfo[i]['audioSource'].start(0, playOffsetSec, duration);
  }

  stopTrack (i) {
    this.songBufferInfo[i]['audioSource'].stop();
    this._resetTrackSource(i);
  }

  playMixTrack (playOffsetSec, duration) {
    if (this.songBufferInfo[0]['audioSource'] === null) {
      this._resetTrackSource(0);
    }
    if (typeof(playOffsetSec) === 'undefined') {
      playOffsetSec = 0;
    }
    this.songBufferInfo[0]['audioSource'].start(0, playOffsetSec, duration);
  }

};
