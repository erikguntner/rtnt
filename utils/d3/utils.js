import {
  axisLeft,
  axisBottom,
  format,
  scaleLinear,
  scaleBand,
  extent,
  select,
  curveMonotoneX,
  curveBasis,
  line,
  csv,
  max,
} from 'd3';

import { popData, lineData } from './mockData';

export const renderBarChart = data => {
  const margin = { top: 20, right: 20, bottom: 20, left: 100 };
  const svg = select('.line-chart');
  const width = +svg.attr('width');
  const height = +svg.attr('height');
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const xValue = d => d.population;
  const yValue = d => d.country;

  const xScale = scaleLinear()
    .domain([0, max(data, xValue)])
    .range([0, innerWidth]);

  const yScale = scaleBand()
    .domain(data.map(yValue))
    .range([innerHeight, 0])
    .padding(0.1);

  const g = svg
    .append('g')
    .attr('transform', `translate(${margin.left} ${margin.top})`);

  g.append('g').call(axisLeft(yScale));
  g.append('g')
    .call(axisBottom(xScale))
    .attr('transform', `translate(0 ${innerHeight})`);

  g.selectAll('rect')
    .data(data)
    .enter()
    .append('rect')
    .attr('y', d => yScale(yValue(d)))
    .attr('width', d => xScale(xValue(d)))
    .attr('height', yScale.bandwidth());
};

export const renderLineChart = data => {
  const margin = { top: 20, right: 20, bottom: 20, left: 100 };
  const svg = select('.line-chart');
  const width = +svg.attr('width');
  const height = +svg.attr('height');
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const xValue = d => d.distance;
  const yValue = d => d.elevation;

  const xScale = scaleLinear()
    .domain([0, max(data, xValue)])
    .range([0, innerWidth]);

  const yScale = scaleLinear()
    .domain(extent(data, yValue))
    .range([innerHeight, 0]);

  const g = svg
    .append('g')
    .attr('transform', `translate(${margin.left} ${margin.top})`);

  g.append('g').call(axisLeft(yScale));
  g.append('g')
    .call(axisBottom(xScale))
    .attr('transform', `translate(0 ${innerHeight})`);

  const lineGenerator = line()
    .x(d => xScale(xValue(d)))
    .y(d => yScale(yValue(d)))
    .curve(curveMonotoneX);

  g.append('path')
    .attr('class', 'line-path')
    .attr('fill', 'none')
    .attr('stroke', '#000')
    .attr('d', lineGenerator(data));
};

export const createChart = () => {
  // renderBarChart(popData);
  renderLineChart(lineData);
};

// invoke functions to draw appropriate changes
const renderChanges = (points, distance) => {
  drawAxes(points, distance);
  // drawLine(data);
};

export const initializeChart = (points, distance) => {
  buildAxes();
  // buildLine();
  // renderChanges(data);
  renderChanges(points, distance);
};
