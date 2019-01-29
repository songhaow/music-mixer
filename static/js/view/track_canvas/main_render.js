import {TimeUtil} from '/static/js/view/utils/time_util.js';

export const TrackCanvasInterface = {
  initialRender() {
    // This is the original code to render the UI interface
    var trackInputInfoList =  [
      {
        id: 'track1',
        color: 'red',
        backgroundcolor: '#F2D7D5',
        fname: '/static/source_audio/01-SW-042017.txt',
      },
      {
        id: 'track2',
        color: 'green',
        backgroundcolor: '#D1F2EB',
        fname: '/static/source_audio/05-SW-012018-Goldfather-SSL-01.txt',
      },
    ];

    var svgWidth=1400;
    var svgHeight=365;
    var padding = 20;
    var svgBorder=1;
    var bordercolor='black';

    var svg = d3.select("#chartForTrack")
                .append("svg")
                .attr("width", svgWidth)
                .attr("height", svgHeight);
            svg.append("svg:g")
                .attr("transform", "translate(50,50)");

    var borderPath = svg.append("rect")
                   			.attr("x", 0)
                   			.attr("y", 0)
                   			.attr("height", svgHeight)
                   			.attr("width", svgWidth)
                   			.style("stroke", bordercolor)
                   			.style("fill", "#eeeeee")
                   			.style("stroke-width", svgBorder);

    console.log('svg-0: ', svg);

    rerenderTracks(svg, trackInputInfoList);
    renderPlayCursor(svg);
    bindEventHandlers(svg, trackInputInfoList);
    baseAxis(svg, svgWidth);
  },

  getTrack2LengthPx() {
    // We find the html element that has the track2 id (which is set by passing
    // the trackInputInfoList 'id' field down through the render functions) and
    // return it's length in pixels
    return Number(d3.select('#track2').attr('width'));
  },

  getTrack2PosPx() {
    return positionObj.track2Start;
  },

  getPlayCursorPosPx() {
    return positionObj.playCursor;
  }
};

var positionObj = {
  track1Start:0, // track1 starting coordinate (track1 not move for now)
  track2Start:0, // track2 starting coordinate, changes with dragging
  playCursor: 0, // playcursor in global coordinate
  play1X:0,    // play1X = playCursor - track1Start
  play2X:0,     // play2X = playCursor - track2Start
  play1Scale:1,
  play2Scale:1,
};

//Draw a base coordinate showing pixal position in the X direction
function baseAxis(mainSvgEl,svgWidth){
  var axisScale = d3.scaleLinear()
                    .domain([0,svgWidth])
                    .range([0,svgWidth]);
  var xAxis = d3.axisBottom().scale(axisScale);
  var xAxis00 = mainSvgEl.append("g");
      xAxis00.attr('transform', 'translate(0,320)');
      xAxis00.call(xAxis);

  var texty =mainSvgEl.append('text')
          .attr('x', 600)
          .attr('y', 355)
          // .style('fill', color)
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
    positionObj.playCursor = d3.event.offsetX;
    playCursorRect.attr('destX', positionObj.playCursor);
  });
  mainSvgEl.on('mouseup', function() {
    positionObj.playCursor = playCursorRect.attr('destX');
    playCursorRect.attr('x', positionObj.playCursor);
    positionObj.play1X=(positionObj.playCursor-positionObj.track1Start)/positionObj.play1Scale;
    positionObj.play2X=(positionObj.playCursor-positionObj.track2Start)/positionObj.play2Scale;
    console.log('playCursor: ', positionObj.playCursor);
    console.log('play1X, play2X: ', positionObj.play1X, positionObj.play2X);
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
    var htmlElementId = trackInputInfo.id;
    var fname = trackInputInfo.fname;
    var color = trackInputInfo.color;
    var bckgdcolor = trackInputInfo.backgroundcolor;
    var trackTopY = i * (trackPaddingPx + trackHeightPx) + trackPaddingPx;
    var trackBottomY = trackTopY + trackHeightPx;

    var trackDisplayGroup = svg.append('g');
    trackDisplayGroup.attr('class', 'trackDisplayGroup');
    renderAllTrackInfo(
      htmlElementId, trackDisplayGroup, fname, trackTopY, trackBottomY, color,
      bckgdcolor, i);
  });
}

/**
 * @param {String}    htmlElementId, Id string for html element so we can access
 *   things like track pixel width
 * @param {svg group} trackDisplayGroup: SVG group that the track info should be created in
 * @param {String}    fname: File system path where json file with track info is stored
 * @param {Number}    trackTopY: Y coordinate on SVG canvas for top of track
 * @param {Number}    trackBottomY: Y coordinate on SVG canvas for bottom of track
 * @param {String}    color: Color to render track in
 */
function renderAllTrackInfo(
    htmlElementId, trackDisplayGroup, fname, trackTopY, trackBottomY, color,
    bckgdcolor, i) {
  d3.json(fname, function(error, data) {
    var bpm01 = data.bpm;
    bpm01 = d3.format(".0f")(bpm01)
    var beatListArray = data.beat_list;
    var xOffset = d3.min(beatListArray);
    var xMin = 0;
    var xMax = d3.max(beatListArray);
    var axisScale = d3.scaleLinear()
                      .domain([xMin,xMax])
                      .range([0,1400]);
    var xScale = 1400/xMax;

    if (i==0){positionObj.play1Scale = xScale}
    else{positionObj.play2Scale = xScale}

    // var xStart = xScale*beatListArray[0];
    var xStart = 0;
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
      htmlElementId, trackLinesGroup, beatListArray, color, bckgdcolor,
      trackTopY, trackBottomY, xScale, xAxis, xStart,i,xOffset);
  });
}

/**
 * @param xScale: how much to "zoom in" x axis
 */
function renderDraggableTrack(
        htmlElementId, trackLinesGroup, beatListArray, color, bckgdcolor,
        trackTopY, trackBottomY, xScale, xAxis, xStart, i, xOffset) {

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
      trackBkgrnd.attr('id', htmlElementId);
      trackBkgrnd.attr('fill', bckgdcolor);
      trackBkgrnd.attr('class', 'dragRect');
      trackBkgrnd.attr('x', '0');
      trackBkgrnd.attr('y', trackTopY);
      trackBkgrnd.attr('width', xMax);
      trackBkgrnd.attr('height', trackBottomY - trackTopY);

  // Add axis to view the pitch locations
  var xAxis01 = trackLinesGroup.append("g");
      xAxis01.attr('transform', 'translate(0,'+trackBottomY+')')
      xAxis01.call(xAxis);

  var ii;
  var beatListScaled = [];
  for (ii = 0; ii < beatListArray.length; ii++)
      { beatListScaled[ii] = (beatListArray[ii]-xOffset)*xScale}

  // console.log('beatListScale: ',beatListScaled);

  var beatLines = trackLinesGroup.selectAll('line')
                  .data(beatListScaled);
      beatLines.enter().append('line')
        .style('stroke', color)
        .attr('stroke-width', 1)
        .attr('x1', function(d) {return d})
        .attr('x2', function(d) {return d})
        .attr('y1', trackTopY)
        .attr('y2', trackBottomY);
  beatLines.exit().remove();

  // console.log('d[0]: ', beatListScaled[0]);
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

function dragended() {
  d3.select(this).classed("active", false);
  positionObj.track2Start = positionObj.track2Start + (d3.event.x - d3.event.subject.x);
  console.log('mouseDownX: ', d3.event.subject.x);
  console.log('mouseUpX: ',d3.event.x);
  console.log('track2Start-new:', positionObj.track2Start);
}
