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
       {
         'song title 1': {
           'buffer': <some song data>,
           'bpm': 95.23,
           'audioSource': null,
         },
         'song title 2': {
           'buffer': <some song data>,
           'bpm': 123.32,
           'audioSource': null,
         },
         ...
       }
     */
    this.songBufferInfo = {};


    // old class attributes
    this.audioBuffer1 = null;
    this.audioSource1 = null;
    this.audioBuffer2 = null;
    this.audioSource2 = null;
  }

  /**
   * The methods in the OLD METHODS section (below) are the older methods that
   * were very specific to a single song (audioBuffer1, audioSource1, etc).
   *
   * We want to write new ones that can handle any number of songs that this
   * buffer manager will handle.
   */


  /**
   * We have a new audioBuffer for the song identified by songName. We want to
   * save in our song data manager.
   *
   * @param {String} songName, name of the song -- this is the unique key that
   *   identifies song information in this class's songBufferInfo mapping
   *   object
   * @param {Object} audioBuffer, song data -- this is data we want to associate
   *   with the songName
   */
  setTrackBuffer (songName, audioBuffer) {
    /**
     * There are 2 cases we need to deal with
     * 1. TrackAudioManager has never seen this song before and we are
     *   creating a new entry
     * 2. TrackAudioManager has this song already and we are updating the
     *   buffer
     */

    // first check if we have this song already
    var songInfo = this.songBufferInfo[songName];
    if (!songInfo) {
      // If we haven't seen this song before, we want to "create an entry" for
      // it in our mapping object
      this.songBufferInfo[songName] = {};
    }

    // now we know there is a mapping for our song, so we can set the audio
    // buffer with the right data
    this.songBufferInfo[songName]['buffer'] = audioBuffer;
  }

  /**
   * @param {String} songName, name of the song which is the key into the
   *   songBufferInfo map object
   */
  getTrackLengthMS (songName) {
    // First get the audio buffer from this.songBufferInfo mapping dictionary
    // You can read this to understand dictionaries more:
    //   http://pietschsoft.com/post/2015/09/05/JavaScript-Basics-How-to-create-a-Dictionary-with-KeyValue-pairs
    // Then copy the same calculations in the getTrack1LengthMS below to return
    //   the length
    var buffer = this.songBufferInfo[songName]['buffer'];
    if (buffer === null) {
      // If sound is not loaded yet, we return default length of 0
      return 0;
    }
    // Sample rate is # of samples per second (typically 44kHz)
    var sampleRate = buffer.sampleRate;
    // Get array of samples from the left channel (0th element in array of
    // channels)
    var leftChannelSampleArray = buffer.getChannelData(0);
    var length = 1000 * (leftChannelSampleArray.length / sampleRate);
    console.log(length);
    return length;
  }

  /**
   * FIRST TODO: Fill out this method which is a more generic method of
   * _resetTrackSource1. This method is for creating an Audio Buffer Source
   * javascript object that will play music after it is given a song's contents.
   *
   * You can read about how the audio buffer source and web audio framework
   * works here -- https://www.html5rocks.com/en/tutorials/webaudio/intro/
   *
   * Basically works with the following steps:
   * 1. You create an Audio Buffer Source object with createBufferSource
   * 2. You give it the song contents you want it to play (called the buffer)
   * 3. You connect the Audio Buffer Source output to the output of the
   *   AudioContext. The AudioContext is a global object in the WebAudio
   *   library that plays music through your speakers.
   * Once the above is done, you should be able to play music from the
   * Audio Buffer Source to your computer speakers.
   *
   * For us:
   * - The audio buffer is in the song information which can be looked up in
   *   our song info dictionary: this.songBufferInfo
   *
   * YOUR TASK:
   * Duplicate how _resetTrackSource1 is written to create and set a
   * AudioBufferSource object and then save it on to the song information
   * object
   * Steps below
   */
  _resetTrackSource (songName) {
    // 1. Get the song information dictionary by looking it up by songName in
    // this.songBufferInfo
    // Looking up the song looks something like the first line in
    //   getTrackLengthMS

    // 2. Create an Audio Buffer Source with the createBufferSource function
    // In the old _resetTrackSource1 function, this was:
    //     this.audioSource1 = audioCtx.createBufferSource();

    // 3. Set the song's buffer contents from the song information dictionary
    //    (step 1) on the audioSource object's buffer field
    // In the old _resetTrackSource1 function, this was:
    //     this.audioSource1.buffer = this.audioBuffer1;


     // 4. Take the audio buffer source object created (step 2) and connect
     //    it to the audioCtx destination
     // In the old _resetTrackSource1 function, this was:
     //    this.audioSource1.connect(audioCtx.destination);
  }

  /**
   * SECOND TODO: Fill out this method so that we can play music for any given track
   * @param {String} songName, name of the song which is the key into the
   *   songBufferInfo map object
   * @param {Number} playOffsetSec, Number of seconds into the track that we
   *   want to play from.
   */
  playTrack (songName, playOffsetSec) {
    /**
     * DIRECTIONS:
     * - Use playTrack1 method (further down in this file) as a guide
     * - Then implement the steps listed below
     */

    // 1. Get the song information dictionary from this.songBufferInfo

    // 2. The song info dict will have the following form:
    //    {
    //      'buffer': <some song data>,
    //      'bpm': 95.23,
    //      'audioSource': null,
    //    },

    // 3. Check if the audioSource attribute on the song information dict is
    //    undefined.  If it's undefined, you need to call _resetTrackSource
    //    with the songName

    // 4. Call the start() function on the audioSource attribute of the song
    //    info dict and the song shouls start playing.  start() has 2
    //    arguments, the first is the delay to wait before playing (set this to
    //    0) and the second is the offset into the song to start playing from
    //    (this is playOffsetSec)
    

  }


  /*** OLD METHODS ***/

  /**
   * TODO: delete this entire method -- it's no longer used
   */
  getTrack1LengthMS() {
    if (this.audioBuffer1 === null) {
      // If sound is not loaded yet, we return default length of 0
      return 0;
    }
    // Sample rate is # of samples per second (typically 44kHz)
    var sampleRate = this.audioBuffer1.sampleRate;
    // Get array of samples from the left channel (0th element in array of
    // channels)
    var leftChannelSampleArray = this.audioBuffer1.getChannelData(0);
    return 1000 * (leftChannelSampleArray.length / sampleRate);
  }


  setTrackBuffer1 (audioBuffer) {
    this.audioBuffer1 = audioBuffer;
  }


  _resetTrackSource1 () {
    this.audioSource1 = audioCtx.createBufferSource();
    this.audioSource1.buffer = this.audioBuffer1;
    this.audioSource1.connect(audioCtx.destination);
  }

  /**
   * @param {Number} playOffsetSec, Number of seconds into the track that we
   *   want to play from.
   */
  playTrack1 (playOffsetSec) {
    if (this.audioSource1 === null) {
      // Here, we set the audioSource if it has not been created yet
      this._resetTrackSource1();
    }
    // If playOffsetSec parameter was not passed in, then it will be "undefined"
    // In this case, we set the default value of 0
    if (typeof(playOffsetSec) === 'undefined') {
      playOffsetSec = 0;
    }
    this.audioSource1.start(0, playOffsetSec);
  }

  stopTrack1 () {
    this.audioSource1.stop();
    this._resetTrackSource1();
  }
};
