import {TimeUtil} from '/static/js/view/utils/time_util.js';

export const PositionObj = {
  track1Start:0, // track1 starting coordinate (track1 not move for now)
  track2Start:0, // track2 starting coordinate, changes with dragging
  playCursor: 0, // playcursor in global coordinate
  play1X:0,    // play1X = playCursor - track1Start
  play2X:0,     // play2X = playCursor - track2Start
  play1Scale:1,
  play2Scale:1,
  track1Length:0,
  track2Length:0
}

export const TrackCanvasInterface = {
  initialRender(f1, bpm1, list1, wave1, waveL1, waveR1, duration1, f2, bpm2, list2, wave2, waveL2, waveR2, duration2) {
    var trackInputInfoList = [
      {
        color: '#FFC0CB',
        backgroundcolor: 'rgba(255, 0, 0, 0.05)',
        fname: f1,
        bpm: bpm1,
        beat_list: list1,
        wave: wave1,
        waveL: waveL1,
        waveR: waveR1,
        duration: duration1
      },
      {
        color: '#7FFF00',
        backgroundcolor: 'rgba(0, 255, 0, 0.05)',
        fname: f2,
        bpm: bpm2,
        beat_list: list2,
        wave: wave2,
        waveL: waveL2,
        waveR: waveR2,
        duration: duration2
      },
    ];

    var svg = d3.select('svg');
    rerenderTracks(svg, trackInputInfoList);
    renderPlayCursor(svg);
    bindEventHandlers(svg);
    baseAxis(svg);
  },

  getTrack2LengthPx() {
    var Track2LengthPx = Number(d3.select('#track2').attr('width'));
    return Track2LengthPx;
  },

  getTrack2PosPx() {
    return PositionObj.track2Start;
  },

  getPlayCursorPosPx() {
    return PositionObj.playCursor;
  },
}

//Draw a base coordinate showing pixal position in the X direction
function baseAxis(mainSvgEl){
  var w = mainSvgEl.attr('width');
  var axisScale = d3.scaleLinear()
                    .domain([0,w])
                    .range([0,w]);
  var xAxis = d3.axisBottom().scale(axisScale);
  var xAxis00 = mainSvgEl.append("g");
      xAxis00.attr('transform', 'translate(0,320)');
      xAxis00.call(xAxis);

  var texty =mainSvgEl.append('text')
          .attr('x', 670)
          .attr('y', 355)
          .attr('fill', '#FFFACD')
          .style('font-size', '14px')
          .style('font-weight', 'bold')
          .text('Global coordinate');
}

/**
 * Render the blinking play cursor-line initially at position 0
 * @param mainSvgEl: main SVG element to draw on
 */
function renderPlayCursor(mainSvgEl) {
  var playCursorRect = mainSvgEl.append('rect')
                                .attr('id', 'playCursorRect')
                                .attr('height', mainSvgEl.attr('height'))
                                .attr('width', 2)
                                .attr('fill', 'blue');
}

/**
 * Central function for defining event handling on SVG element.  We centralize
 * SVG event handling here so it will be easy to see and manage possible
 * different events we want to have.
 */
function bindEventHandlers(mainSvgEl) {
  // Play Cursor is a <rect> element with id "playCursorRect". Using HTML id
  // attr because there should only be one cursor.
  var playCursorRect = mainSvgEl.select('#playCursorRect');
  mainSvgEl.on('mousedown', function() {
    PositionObj.playCursor = d3.event.offsetX;
    playCursorRect.attr('destX', PositionObj.playCursor);
  });
  mainSvgEl.on('mouseup', function() {
    PositionObj.playCursor = playCursorRect.attr('destX');
    playCursorRect.attr('x', PositionObj.playCursor);
    PositionObj.play1X=(PositionObj.playCursor-PositionObj.track1Start)/PositionObj.play1Scale;
    PositionObj.play2X=(PositionObj.playCursor-PositionObj.track2Start)/PositionObj.play2Scale;
    var cursorX = PositionObj.playCursor;
    var play1X = PositionObj.play1X;
    var play2X = PositionObj.play2X;
    play1X = play1X.toFixed(2);
    play2X = play2X.toFixed(2);
    console.log('playCursor, play1X, play2X: ', cursorX +', '+ play1X +', '+ play2X);
  });

  // Zoom event handler bindings d3.select('#zoomSlider') .on('change', function(evt) {
  //     console.log('zoom:', d3.event.target.value); rerenderTracks(mainSvgEl, trackInputInfoList);
  //   });
}

function rerenderTracks(svg, trackInputInfoList) {
  svg.selectAll('g').remove();

  var trackPaddingPx = 30;
  var trackHeightPx = 70;

  trackInputInfoList.forEach(function(t, i) {
    var fname = t.fname;
    var color = t.color;
    var bckgdcolor = t.backgroundcolor;
    var trackTopY = i *1.5* (trackPaddingPx + trackHeightPx) + trackPaddingPx;
    var trackBottomY = trackTopY + trackHeightPx;

    var trackDisplayGroup = svg.append('g');
    var w = svg.attr('width');
    trackDisplayGroup.attr('class', 'trackDisplayGroup');
    renderAllTrackInfo( i, trackDisplayGroup, fname, trackTopY, trackBottomY, color, bckgdcolor, w, trackInputInfoList);
  });
}

function renderAllTrackInfo(i, trackDisplayGroup, fname, trackTopY, trackBottomY, color, bckgdcolor, w, trackInputInfoList){

    var bpm01 = d3.format(".0f")(trackInputInfoList[i].bpm);
    var beatListArray = trackInputInfoList[i].beat_list; // X direction
    var xMin = 0;
    var xOffset = d3.min(beatListArray);
    var xMax = d3.max(beatListArray);
    var axisScale = d3.scaleLinear()
                      .domain([xMin,xMax])
                      .range([0,w]);
    var xScale = w/xMax;

    var waveListY = [];  // Y direction
    var waveListYL = [];
    var waveListYR = [];
    var xListLength = beatListArray.length;
    for(var j = 0; j< xListLength; j++){
      waveListY[j] = trackBottomY-trackInputInfoList[i].wave[j];
      waveListYL[j] = trackBottomY-trackInputInfoList[i].waveL[j];
      waveListYR[j] = trackBottomY-trackInputInfoList[i].waveR[j];
    };

    if (i==0){
      PositionObj.play1Scale = xScale;
      PositionObj.track1Length = xMax;
    }
    else{
      PositionObj.play2Scale = xScale;
      PositionObj.track2Length = xMax;
    }

    var xStart = 0;
    var xAxis = d3.axisBottom()
                  .scale(axisScale);

// change .txt to .mp3
    var split = fname.split('/');
    var length1 = split.length-1;
    var fnameTxt = split[length1];
    var split = fnameTxt.split('.');
    var fnameTxt = split[0] + '.mp3';

    var j=i+1;
    var tString = TimeUtil.secondsToTimeString(xMax);
    trackDisplayGroup.append('text')
        .attr('x', 20)
        .attr('y', trackTopY - 8)
        .attr('fill', '#FFFACD')
        .style('font-size', '16px')
        // .style('font-weight', 'bold')
        .text('Track'+j+':  '+ fnameTxt + ';  Duration = ' + tString + '[minutes];  bpm = ' +bpm01 );
    // trackDisplayGroup.append('text')
    //     .attr('x', 700)
    //     .attr('y', trackBottomY + 35)
    //     .attr('fill', '#FFFACD')
    //     .text('(Seconds)');

    var trackLinesGroup = trackDisplayGroup.append('g');
    renderDraggableTrack(
      trackLinesGroup, beatListArray, waveListY, waveListYL, waveListYR, color, bckgdcolor,
      trackTopY, trackBottomY, xScale, xAxis, xStart,xOffset);
}

/**
 * @param xScale: how much to "zoom in" x axis
 */
function renderDraggableTrack(
        trackLinesGroup, beatListArray, waveListY, waveListYL, waveListYR, color, bckgdcolor,
        trackTopY, trackBottomY, xScale, xAxis, xStart, xOffset) {

  // X position of the last beat for the track
  var xMax = d3.max(beatListArray) * xScale;

  // Add lines
  trackLinesGroup.attr('class', 'trackLinesGroup');
  trackLinesGroup.call(d3.drag()
                         .on('drag', dragged)
                         .subject(setDragSubject)
                         .on("end", dragended)
                      );

  // Add background rectangle to group for continuous hit area for
  // dragging
  var trackBkgrnd = trackLinesGroup.append('rect');
      // trackBkgrnd.attr('id', htmlElementId);
      trackBkgrnd.attr('fill', bckgdcolor);
      trackBkgrnd.attr('class', 'dragRect');
      trackBkgrnd.attr('x', '0');
      trackBkgrnd.attr('y', trackTopY + trackTopY);
      trackBkgrnd.attr('width', xMax);
      trackBkgrnd.attr('height', trackBottomY - trackTopY);

  // Add axis to view the pitch locations
  var xAxis01 = trackLinesGroup.append("g");
      xAxis01.attr('transform', 'translate(0,'+trackBottomY+')')
      xAxis01.call(xAxis);

  var j, beatListScaled = [];
  for (j = 0; j < beatListArray.length; j++)
      { beatListScaled[j] = (beatListArray[j] - xOffset) * xScale}

  var beatLines = trackLinesGroup.selectAll('line')
                              .data(beatListScaled);
      beatLines.enter().append('rect')
                       .attr('width', 2)
                       .attr('fill', color)
                       .attr('x', function(d,k) {return beatListScaled[k]})
                       .attr('y', function(d,k){return waveListYL[k]})
                       .attr('height', function(d,k){return (trackBottomY-waveListYL[k])});

  var beatLines = trackLinesGroup.selectAll('line')
                              .data(beatListScaled);
      beatLines.enter().append('rect')
                        .attr('width', 2)
                        .attr('fill', color)
                        .attr('x', function(d,k) {return beatListScaled[k]})
                        .attr('y', function(d,k){return trackBottomY})
                        .attr('height', function(d,k){return (trackBottomY-waveListYR[k])});

      // beatLines.enter().append('line')
      //                                   .style('stroke', color)
      //                                   .attr('stroke-width', '8')
      //                                   .attr('x1', function(d,k) {return beatListScaled[k]})
      //                                   .attr('x2', function(d,k) {return beatListScaled[k]})
      //                                   .attr('y1', function(d,k){return waveListY[k]})
      //                                   .attr('y2', trackBottomY);
      beatLines.exit().remove();
}

/**
 * Set the subject's x and y coordinates that we're dragging.
 * This should be the Track Lines Group <g> element which includes the track
 * beat lines and the background hit area <rect>
 */
function setDragSubject() {
  var tempX = this.getCTM().e;
  var baseY = this.getCTM().f;
  return {
    x: d3.event.x,
    y: d3.event.y,
    baseX: tempX,
    baseY: baseY,
  };
}
/**
 * @param d: undefined
 */
function dragged() {
  var newX = d3.event.subject.baseX + (d3.event.x - d3.event.subject.x);
  d3.select(this).attr("transform",
    'translate('+ newX + ',' + d3.event.subject.baseY+')'
  );
}

function dragended(trackInputInfoList) {
  d3.select(this).classed("active", false);
  PositionObj.track2Start = PositionObj.track2Start + (d3.event.x - d3.event.subject.x);
}
