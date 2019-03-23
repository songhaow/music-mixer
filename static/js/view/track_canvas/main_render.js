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
};

export const TrackCanvasInterface = {
  initialRender(f1,f2) {

    var trackInputInfoList =  [
      {
        id: 'track1',
        color: '#FF5722',
        backgroundcolor: '#F2D7D5',
        fname: f1
      },
      {
        id: 'track2',
        color: 'green',
        backgroundcolor: '#D1F2EB',
        fname: f2
      },
    ];

    // change filenames from mp3 into txt
    trackInputInfoList.forEach(function(trackInputInfo, i) {
      var file1name = trackInputInfoList[i].fname;
      var name=file1name.split(".")[0];
      trackInputInfoList[i].fname = '/static/source_audio/'+name+'.txt';
    });

    var svg = d3.select('svg');

    rerenderTracks(svg, trackInputInfoList);
    renderPlayCursor(svg);
    bindEventHandlers(svg, trackInputInfoList);
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
  }
};

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
    PositionObj.playCursor = d3.event.offsetX;
    playCursorRect.attr('destX', PositionObj.playCursor);
  });
  mainSvgEl.on('mouseup', function() {
    PositionObj.playCursor = playCursorRect.attr('destX');
    playCursorRect.attr('x', PositionObj.playCursor);
    PositionObj.play1X=(PositionObj.playCursor-PositionObj.track1Start)/PositionObj.play1Scale;
    PositionObj.play2X=(PositionObj.playCursor-PositionObj.track2Start)/PositionObj.play2Scale;
    console.log('playCursor: ', PositionObj.playCursor);
    console.log('play1X, play2X: ', PositionObj.play1X, PositionObj.play2X);
  });

  // Zoom event handler bindings
  // d3.select('#zoomSlider')
  //   .on('change', function(evt) {
  //     console.log('zoom:', d3.event.target.value);
  //     rerenderTracks(mainSvgEl, trackInputInfoList);
  //   });
}

function rerenderTracks(svg, trackInputInfoList) {
  svg.selectAll('g').remove();

  var trackPaddingPx = 30;
  var trackHeightPx = 70;

  trackInputInfoList.forEach(function(trackInputInfo, i) {
    var htmlElementId = trackInputInfo.id;
    var fname = trackInputInfo.fname;
    var color = trackInputInfo.color;
    var bckgdcolor = trackInputInfo.backgroundcolor;
    var trackTopY = i *1.5* (trackPaddingPx + trackHeightPx) + trackPaddingPx;
    var trackBottomY = trackTopY + trackHeightPx;

    var trackDisplayGroup = svg.append('g');
    var w = svg.attr('width');
    trackDisplayGroup.attr('class', 'trackDisplayGroup');
    renderAllTrackInfo(
      htmlElementId, trackDisplayGroup, fname, trackTopY, trackBottomY, color,
      bckgdcolor, i, w, trackInputInfoList);
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
function renderAllTrackInfo(htmlElementId, trackDisplayGroup, fname, trackTopY, trackBottomY,
  color, bckgdcolor, i, w,trackInputInfoList){
    d3.json(fname, function(error, data) {
    var bpm01 = data.bpm;
    bpm01 = d3.format(".0f")(bpm01)
    var beatListArray = data.beat_list;
    var xOffset = d3.min(beatListArray);
    var xMin = 0;
    var xMax = d3.max(beatListArray);
    console.log('SongLength:', xMax);
    var axisScale = d3.scaleLinear()
                      .domain([xMin,xMax])
                      .range([0,w]);
    var xScale = w/xMax;

    if (i==0){
      PositionObj.play1Scale = xScale;
      PositionObj.track1Length = xMax;
    }
    else{
      PositionObj.play2Scale = xScale;
      PositionObj.track2Length = xMax;
    }

    var xStart = 0;
    var xAxis = d3.axisBottom().scale(axisScale);

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
        .style('font-size', '16px')
        .style('font-weight', 'bold')
        .text('Track'+j+':  '+ fnameTxt + ';  Duration = ' + tString + '[minutes];  bpm = ' +bpm01 );
    trackDisplayGroup.append('text')
        .attr('x', 700)
        .attr('y', trackBottomY + 35)
        .text('(Seconds)');

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

function dragended(trackInputInfoList) {
  d3.select(this).classed("active", false);
  PositionObj.track2Start = PositionObj.track2Start + (d3.event.x - d3.event.subject.x);
  // console.log('mouseDownX: ', d3.event.subject.x);
  // console.log('mouseUpX: ',d3.event.x);
  // console.table('track2Start-new:', PositionObj.track2Start);
}
