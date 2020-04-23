/* eslint-disable @typescript-eslint/ban-ts-ignore */
import { Dispatch, SetStateAction } from 'react';
import {
  area,
  axisLeft,
  brushX,
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

export const renderBrushChart = (
  dimensions: {
    width: number;
    height: number;
  }
) => {
  const margin = { top: 20, right: 30, bottom: 20, left: 50 };
  const height = dimensions.height;
  const width = dimensions.width;
  const svg = select('.brush-chart');
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]


  //@ts-ignore
  // const xValue = d => turfHelpers.convertLength(d.distance, 'meters', units);

  const xScale = scaleLinear()
    .domain([0, max(data)])
    .range([0, innerWidth]);


  const g = svg
    .append('g')
    .attr('transform', `translate(${margin.left} ${margin.top})`);

  g.append('g')
    .call(axisBottom(xScale))
    .attr('transform', `translate(0 ${innerHeight})`)

  const brushG = svg.append('g');


  const brush = brushX()
    .extent([
      [0, 0],
      [width, height]
    ])
  // .on("start brush end", () => {
  //   if (event.selection) {
  //     const indexSelection = event.selection.map(xScale.invert);
  //     setSelection(indexSelection);
  //   }
  // });
  // .append('text')
  // .attr("class", "axis-title")
  // .attr("x", width - margin.right - 30)
  // .attr("y", 15)
  // .style("text-anchor", "end")
  // .attr("fill", "black")
  // .text(units);

};