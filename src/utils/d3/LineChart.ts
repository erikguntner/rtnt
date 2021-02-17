/* eslint-disable @typescript-eslint/ban-ts-ignore */
import { Dispatch, SetStateAction } from 'react';
import {
  area,
  axisLeft,
  axisBottom,
  scaleLinear,
  scaleBand,
  extent,
  select,
  selectAll,
  curveMonotoneX,
  line,
  mouse,
  max,
} from 'd3';
import * as turfHelpers from '@turf/helpers';

interface ElevationData {
  distance: number;
  elevation: number;
}

export const renderLineChart = (
  data: ElevationData[],
  setDistanceAlongPath: Dispatch<SetStateAction<number | null>>,
  units: string,
  dimensions: {
    width: number;
    height: number;
  }
) => {
  const margin = { top: 20, right: 30, bottom: 20, left: 50 };
  const height = dimensions.height;
  const width = dimensions.width;
  const svg = select('.line-chart');
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const yAxisUnits = units === 'miles' ? 'feet' : 'meters';

  //@ts-ignore
  const xValue = d => turfHelpers.convertLength(d.distance, 'meters', units);
  const yValue = d =>
    turfHelpers.convertLength(
      d.elevation,
      'meters',
      //@ts-ignore
      yAxisUnits
    );

  const xScale = scaleLinear()
    .domain([0, max(data, xValue)])
    .range([0, innerWidth]);

  const yScale = scaleLinear()
    .domain(extent(data, yValue))
    .range([innerHeight, 0]);

  const g = svg
    .append('g')
    .attr('transform', `translate(${margin.left} ${margin.top})`);

  g.append('g')
    .call(axisLeft(yScale)
      .ticks(4))
    .append('text')
    .attr("class", "axis-title")
    .attr("y", -4)
    .style("text-anchor", "end")
    .attr("fill", "black")
    .text(yAxisUnits);

  g.append('g')
    .call(axisBottom(xScale))
    .attr('transform', `translate(0 ${innerHeight})`)
  // .append('text')
  // .attr("class", "axis-title")
  // .attr("x", width - margin.right - 30)
  // .attr("y", 15)
  // .style("text-anchor", "end")
  // .attr("fill", "black")
  // .text(units);

  const lineGenerator = line()
    .x(d => xScale(xValue(d)))
    .y(d => yScale(yValue(d)))
    .curve(curveMonotoneX);

  const areaGenerator = area()
    .curve(curveMonotoneX)
    .x(d => xScale(xValue(d)))
    .y0(innerHeight)
    .y1(d => yScale(yValue(d)))

  //Container for the gradients
  const defs = svg.append("defs");

  //Filter for the outside glow
  const filter = defs.append("filter")
    .attr("id", "glow");
  filter.append("feDropShadow")
    .attr("stdDeviation", ".8")
    .attr('dx', 0)
    .attr('dy', 0)
    .attr("flood-color", '#0070f3')
    .attr("result", "coloredBlur");
  // const feMerge = filter.append("feMerge");
  // feMerge.append("feMergeNode")
  //   .attr("in", "coloredBlur");
  // feMerge.append("feMergeNode")
  //   .attr("in", "SourceGraphic");

  const linePath = g
    .append('path')
    .attr('class', 'line-path')
    .attr('fill', 'none')
    .attr('stroke', '#0070f3')
    .attr('stroke-width', '3')
    //@ts-ignore
    .attr('d', lineGenerator(data))
    .style("filter", "url(#glow)");

  //@ts-ignore
  const colorScale = scaleLinear().range(['#0070f3', '#238ffb', '#54acfe', '#85c7fe', '#b6e1fd', '#ebf4ff'])

  //@ts-ignore
  g.append("linearGradient")
    .attr("id", "temperature-gradient")
    // .attr("gradientUnits", "userSpaceOnUse")
    .attr("x1", '0%').attr("y1", '0%')
    .attr("x2", '0%').attr("y2", '100%')
    .selectAll("stop")
    .data(colorScale.range())
    .enter().append("stop")
    .attr("offset", (d, i) => i / (colorScale.range().length - 1))
    .attr("stop-color", (d) => d)
    .attr("stop-opacity", 0.5);



  // g.append("path")
  //   .attr("fill", "#e2e8f0")
  //   //@ts-ignore
  //   .attr("d", areaGenerator(data));

  // black vertical line to follow mouse
  const mouseG = svg.append('g');
  mouseG
    .attr('transform', `translate(${margin.left} ${margin.top})`)
    .attr('class', 'mouse-over-effects');

  mouseG
    .append('path') // this is the black vertical line to follow mouse
    .attr('class', 'mouse-line')
    .style('stroke', 'black')
    .style('stroke-width', '1px')
    .style('opacity', '0');

  const mouseOnLine = mouseG
    .append('g')
    .attr('class', 'mouse');

  mouseOnLine
    .append('circle')
    .attr('r', 7)
    .style('stroke', '#0070f3')
    .style('fill', 'none')
    .style('stroke-width', '2px')
    .style('opacity', '0');

  mouseOnLine
    .append('rect')
    .attr('width', '55')
    .attr('height', '35')
    .attr('transform', 'translate(10, -17.5)')
    .attr('fill', '#fff')
    .attr('stroke', 'black')
    .style('opacity', '0');

  mouseOnLine
    .append('text')
    .attr('transform', 'translate(15, -3)')
    .attr('class', 'distance-text');

  mouseOnLine
    .append('text')
    .attr('transform', 'translate(15, 10)')
    .attr('class', 'elevation-text');

  const mouseOut = () => {
    // on mouse out hide line, circles and text
    select('.mouse-line').style('opacity', '0');
    select('.mouse circle').style('opacity', '0');
    selectAll('.mouse text').style('opacity', '0');
    selectAll('.mouse rect').style('opacity', '0');
    setDistanceAlongPath(0);
  }

  const mouseOver = () => {
    // on mouse in show line, circles and text
    select('.mouse-line').style('opacity', '1');
    select('.mouse circle').style('opacity', '1');
    selectAll('.mouse text').style('opacity', '1');
    selectAll('.mouse rect').style('opacity', '1');
  }

  function mouseMove() {
    // mouse moving over canvas
    //@ts-ignore
    const mouseCoords = mouse(this);
    select('.mouse-line').attr('d', function () {
      let d = 'M' + mouseCoords[0] + ',' + innerHeight;
      d += ' ' + mouseCoords[0] + ',' + 0;
      return d;
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    select('.mouse').attr('transform', function (d: ElevationData[]) {
      let beginning = 0;
      let end = linePath.node().getTotalLength();
      let pos = null;
      // const target = null;

      while (true) {
        const target = Math.floor((beginning + end) / 2);
        pos = linePath.node().getPointAtLength(target);
        if (
          (target === end || target === beginning) &&
          pos.x !== mouseCoords[0]
        ) {
          break;
        }
        if (pos.x > mouseCoords[0]) end = target;
        else if (pos.x < mouseCoords[0]) beginning = target;
        else break; //position found
      }

      setDistanceAlongPath(+xScale.invert(pos.x));
      const elevationAbbrev: string = units === 'miles' ? 'ft' : 'm';
      const distanceAbbrev: string = units === 'miles' ? 'mi' : 'km';

      select(this)
        .select('.elevation-text')
        .text(`${yScale.invert(pos.y).toFixed(2)} ${elevationAbbrev}`);

      select(this)
        .select('.distance-text')
        .text(`${xScale.invert(pos.x).toFixed(2)} ${distanceAbbrev}`);

      return `translate(${mouseCoords[0]}, ${pos.y})`;
    });
  }

  mouseG
    .append('svg:rect') // append a rect to catch mouse movements on canvas
    .attr('width', innerWidth) // can't catch mouse events on a g element
    .attr('height', innerHeight)
    .attr('fill', 'none')
    .attr('pointer-events', 'all')
    .on('mouseout', mouseOut)
    .on('mouseover', mouseOver)
    .on('mousemove', mouseMove)
    .on('touchend', mouseOut)
    .on('touchstart', mouseOver)
    .on('touchmove', mouseMove);
};

export const createChart = (
  data: ElevationData[],
  setDistanceAlongPath: Dispatch<SetStateAction<number | null>>,
  units: string,
  dimensions: {
    width: number;
    height: number;
  }
) => {
  // renderBarChart(popData);
  renderLineChart(data, setDistanceAlongPath, units, dimensions);
};