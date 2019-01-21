const AudioContext = window.AudioContext || window.webkitAudioContext;
export const audioCtx = new AudioContext();
// const track1Element = document.querySelector('#track1');
// const trackNode = audioCtx.createMediaElementSource(track1Element);
// trackNode.connect(audioCtx.destination);
var audioSource = null;

// todo: refactor to track audio manager file
export class TrackAudioManager {
  constructor () {
    this.audioBuffer1 = null;
    this.audioSource1 = null;
  }

  /**
   * Get track1 length in milliseconds based on the audio data in the
   * audioBuffer that is loaded from the backend
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

  resetTrackSource1 () {
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
      this.resetTrackSource1();
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
    this.resetTrackSource1();
  }
};
