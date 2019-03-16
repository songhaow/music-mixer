const AudioContext = window.AudioContext || window.webkitAudioContext;
export const audioCtx = new AudioContext();
// const track1Element = document.querySelector('#track1');
// const trackNode = audioCtx.createMediaElementSource(track1Element);
// trackNode.connect(audioCtx.destination);
var audioSource = null;

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
    /**
     * New song attribute info be a dictionary. It will keep a mapping of song
     * names to buffer information like this:
     */
    this.songBufferInfo = {
       '02-SW-062018.mp3': {
         'buffer': null,
         'bpm': 95.23,
         'audioSource': null,
       },
       '07-Littlewhiteboat.mp3': {
         'buffer': null,
         'bpm': 123.32,
         'audioSource': null,
       },
   }
}

  setTrackBuffer (songName, audioBuffer) {
    // first check if we have this song already
    var songInfo = this.songBufferInfo[songName];
    console.log('songInfo: ', songInfo);
    if (!songInfo) {
      // If we haven't seen this song before, we want to "create an entry" for
      // it in our mapping object
      this.songBufferInfo[songName] = {};
    }
    // now we know there is a mapping for our song, so we can set the audio
    // buffer with the right data
    this.songBufferInfo[songName]['buffer'] = audioBuffer;
  }

  _resetTrackSource (songName) {
    this.songBufferInfo[songName]['audioSource'] = audioCtx.createBufferSource();
    this.songBufferInfo[songName]['audioSource'].buffer = this.songBufferInfo[songName]['buffer'];
    this.songBufferInfo[songName]['audioSource'].connect(audioCtx.destination);
  }

  playTrack (songName, playOffsetSec) {
    if (this.songBufferInfo[songName]['audioSource'] === null) {
      // Here, we set the audioSource if it has not been created yet
      // var songNamei = this.songBufferInfo;
      this._resetTrackSource(songName);
    }
    // If playOffsetSec parameter was not passed in, then it will be "undefined"
    // In this case, we set the default value of 0
    if (typeof(playOffsetSec) === 'undefined') {
      playOffsetSec = 0;
    }
    this.songBufferInfo[songName]['audioSource'].start(0, playOffsetSec);
  }

  stopTrack (songName) {
    this.songBufferInfo[songName]['audioSource'].stop();
    this._resetTrackSource(songName);
  }

};
