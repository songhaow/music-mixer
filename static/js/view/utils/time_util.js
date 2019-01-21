export const TimeUtil = {
  /**
   * @param {int} timeInSeconds
   */
  secondsToTimeString(timeInSeconds) {
    var timeSecond=timeInSeconds%60.0;
    var timeMinute=timeInSeconds/60;
    timeMinute=Math.floor(timeMinute);
    timeSecond=Math.floor(timeSecond);
    var M = timeMinute.toString();
    var S = timeSecond.toString();
    return M + ':' + S;
  }
};
