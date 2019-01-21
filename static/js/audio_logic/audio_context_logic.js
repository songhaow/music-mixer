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

  setTrackBuffer1 (audioBuffer) {
    this.audioBuffer1 = audioBuffer;
  }

  resetTrackSource1 () {
    this.audioSource1 = audioCtx.createBufferSource();
    this.audioSource1.buffer = this.audioBuffer1;
    this.audioSource1.connect(audioCtx.destination);
  }

  playTrack1 () {
    if (this.audioSource1 === null) {
      this.resetTrackSource1();
    }
    this.audioSource1.start(0); //this start look like delay in seconds
  }

  stopTrack1 () {
    this.audioSource1.stop();
    this.resetTrackSource1();
  }
};
