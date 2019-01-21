import {TimeUtil} from '/static/js/view/utils/time_util.js';

export const TrackCanvasInterface = {
  initialRender() {
    // This is the original code to render the UI interface
    var trackInputInfoList =  [
      {
        color: 'red',
        backgroundcolor: '#F2D7D5',
        fname: '/static/source_audio/01-SW-042017.txt',
      },
      {
        color: 'green',
        backgroundcolor: '#D1F2EB',
        fname: '/static/source_audio/02-SW-062018.txt',
      },
    ];

    var svg = d3.select('svg');
    rerenderTracks(svg, trackInputInfoList);
    renderPlayCursor(svg);
    bindEventHandlers(svg, trackInputInfoList);
  },

  getTrack1Start() {
    return positionObj.track1Start;
  }
};

var positionObj = {
  track1Start:0, // track1 starting coordinate (not change for now)
  track2Start:0, // track2 starting coordinate, changes with dragging
  startPos: 0,
  endPos: 0,
  playCursor: 0, // playcursor in global coordinate
  play1X:0,    // play starting point
  play2X:0     // play starting point
};

/**
 * Central function for defining event handling on SVG element.  We centralize
 * SVG event handling here so it will be easy to see and manage possible
 * different events we want to have.
 */
function bindEventHandlers(mainSvgEl, trackInputInfoList) {
  // Play Cursor is a <rect> element with id "playCursorRect". Using HTML id
  // attr because there should only be one cursor.
  var playCursorRect = mainSvgEl.select('#playCursorRect');
  mainSvgEl.on('mousedown', function() {
    positionObj.playCursor = d3.event.offsetX
    // console.log('playCursor01: ', positionObj.playCursor);
    playCursorRect.attr('destX', positionObj.playCursor);
  });
  mainSvgEl.on('mouseup', function() {
    positionObj.playCursor = playCursorRect.attr('destX');
    playCursorRect.attr('x', positionObj.playCursor);
    positionObj.play1X=positionObj.playCursor-positionObj.track1Start;
    console.log('startX: ', positionObj.track1Start);
    console.log('playCursor: ', positionObj.playCursor);
    console.log('play1X: ', positionObj.play1X);
  });

  // Zoom event handler bindings
  d3.select('#zoomSlider')
    .on('change', function(evt) {
      console.log('zoom:', d3.event.target.value);
      rerenderTracks(mainSvgEl, trackInputInfoList);
    });
}

function rerenderTracks(svg, trackInputInfoList) {
  svg.selectAll('g').remove();

  var trackPaddingPx = 55;
  var trackHeightPx = 80;
  trackInputInfoList.forEach(function(trackInputInfo, i) {
    var fname = trackInputInfo.fname;
    var color = trackInputInfo.color;
    var bckgdcolor = trackInputInfo.backgroundcolor;
    var trackTopY = i * (trackPaddingPx + trackHeightPx) + trackPaddingPx;
    var trackBottomY = trackTopY + trackHeightPx;

    var trackDisplayGroup = svg.append('g');
    trackDisplayGroup.attr('class', 'trackDisplayGroup');

    renderAllTrackInfo(trackDisplayGroup, fname, trackTopY, trackBottomY, color,bckgdcolor,i);
  });
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
  // consle.log('playCursorRect', playCursorRect);
};

/**
 * @param {svg group} trackDisplayGroup: SVG group that the track info should be created in
 * @param {String}    fname: File system path where json file with track info is stored
 * @param {Number}    trackTopY: Y coordinate on SVG canvas for top of track
 * @param {Number}    trackBottomY: Y coordinate on SVG canvas for bottom of track
 * @param {String}    color: Color to render track in
 */
function renderAllTrackInfo(trackDisplayGroup, fname, trackTopY, trackBottomY, color,bckgdcolor,i) {
  d3.json(fname, function(error, data) {
    var bpm01 = data.bpm;
    bpm01 = d3.format(".0f")(bpm01)
    var beatListArray = data.beat_list;
    var xMin = d3.min(beatListArray);
    var xMax = d3.max(beatListArray);
    var axisScale = d3.scaleLinear()
                      .domain([xMin,xMax])
                      .range([0,1200]);
    var xScale = 1200/xMax;

    if (i==0){positionObj.track1Start = xScale*beatListArray[0];}
    else{positionObj.track2Start = xScale*beatListArray[0];}

    var xStart = xScale*beatListArray[0];
    var xAxis = d3.axisBottom().scale(axisScale);

    var j=i+1;
    var tString = TimeUtil.secondsToTimeString(xMax);
    trackDisplayGroup.append('text')
        .attr('x', 20)
        .attr('y', trackTopY - 8)
        // .style('fill', color)
        .style('font-size', '16px')
        .style('font-weight', 'bold')
        .text('Song#'+j+':  '+ fname + ';  Duration = ' + tString + '[minutes];  bpm'+j+'=' +bpm01 );

    var trackLinesGroup = trackDisplayGroup.append('g');
    renderDraggableTrack(
      trackLinesGroup, beatListArray, color, bckgdcolor,trackTopY, trackBottomY, xScale, xAxis,xStart,i);

  });

}

/**
 * @param xScale: how much to "zoom in" x axis
 */
function renderDraggableTrack(
        trackLinesGroup, beatListArray, color, bckgdcolor, trackTopY, trackBottomY,
        xScale, xAxis, xStart,i) {
  // X position of the last beat for the track
  var xMax = d3.max(beatListArray) * xScale;

  // Add lines
  trackLinesGroup.attr('class', 'trackLinesGroup');
  trackLinesGroup.call(
    d3.drag()
      .on('drag', dragged)
      .subject(setDragSubject)
      .on("end", dragended)
  );

  // Add background rectangle to group for continuous hit area for
  // dragging
  var trackBkgrnd = trackLinesGroup.append('rect');
  trackBkgrnd.attr('fill', bckgdcolor);
  trackBkgrnd.attr('class', 'dragRect');
  trackBkgrnd.attr('x',positionObj.track1Start);
  console.log('xStart', positionObj.track1Start);
  trackBkgrnd.attr('y', trackTopY);
  trackBkgrnd.attr('width', xMax);
  trackBkgrnd.attr('height', trackBottomY - trackTopY);

  var xAxis01 = trackLinesGroup.append("g")
      .attr('transform', function(d) {return 'translate('+positionObj.track1Start+',' +trackBottomY+ ')';})
      .call(xAxis);

  var beatLines = trackLinesGroup.selectAll('line')
          .data(beatListArray);
  beatLines.enter().append('line')
      .style('stroke', color)
      .attr('stroke-width', 1)
      .attr('x1', function(d) {return (d*xScale-positionObj.track1Start)})
      .attr('x2', function(d) {return (d*xScale-positionObj.track1Start)})
      .attr('y1', trackTopY)
      .attr('y2', trackBottomY);
  beatLines.exit().remove();
}

/**
 * Set the subject's x and y coordinates that we're dragging.
 * This should be the Track Lines Group <g> element which includes the track
 * beat lines and the background hit area <rect>
 */
function setDragSubject() {
  positionObj.startPos = this.getCTM().e;
  var baseY = this.getCTM().f;
  // positionObj.startPos = baseX;
  console.log('startX::: ', positionObj.startPos);
  return {
    x: d3.event.x,
    y: d3.event.y,
    baseX: positionObj.startPos,
    baseY: baseY,
  };
}

/**
 * @param d: undefined
 */
function dragged() {
  var newX = d3.event.subject.baseX + (d3.event.x - d3.event.subject.x);
  d3.select(this).attr(
    "transform",
    'translate('
    + newX
    + ','
    + d3.event.subject.baseY
    +')'
  );
  // console.log('newX: ', newX)
  // console.log('d3.event.subject.baseX: ',d3.event.subject.baseX);
  // console.log('d3.event.x: ', d3.event.x);
  // console.log('d3.event.subject.x: ', d3.event.subject.x);
}

function dragended() {
  d3.select(this).classed("active", false);
  positionObj.endPos =d3.event.x;
  console.log('d3.event.subject.baseX: ',d3.event.subject.baseX);
  console.log('d3.event.x: ', d3.event.x);
  console.log('d3.event.subject.x: ', d3.event.subject.x);
  console.log('endX: ', positionObj.endPos);
  var tempX = positionObj.playCursor-positionObj.track1Start;
  console.log('tempX: ', tempX);
}
