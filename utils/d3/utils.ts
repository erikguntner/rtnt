import {
  axisLeft,
  axisBottom,
  format,
  scaleLinear,
  scale,
  select,
  curveMonotoneX,
  line as d3Line,
} from 'd3';

const margin = {
  top: 20,
  right: 80,
  bottom: 30,
  left: 50,
};
const width = 700 - margin.left - margin.right;
const height = 230 - margin.top - margin.bottom;

/**
 * create x- and y-scales
 */
const xScale = scaleLinear().range([0, width]);

const yScale = scaleLinear().range([height, 0]);

/**
 * scale data points according to their respective domain/range configuration
 */
const scaleXData = point => {
  return xScale(new Date(point.timestamp));
};

const scaleYData = point => {
  return yScale(point.value);
};

/**
 * create x- and y-axes
 */

const yAxis = axisLeft(yScale);

const xAxis = axisBottom(xScale);

/**
 * build the elements that will be contained within our main SVG
 */
const buildAxes = () => {
  select('.line-chart')
    .append('g')
    .attr('class', 'line-chart-yaxis');

  select('.line-chart')
    .append('g')
    .attr('class', 'line-chart-xaxis');
};

const buildLine = () => {
  select('.line-chart')
    .append('path')
    .attr('class', 'line-chart-line');
};

/**
 * draw elements of the chart based on current settings
 */
const drawAxes = () => {
  select('.line-chart-yaxis').call(yAxis);
  select('.line-chart-xaxis')
    .attr('transform', `translate(0 ${height})`)
    .call(xAxis);
};

const drawLine = data => {
  const line = d3Line()
    .x(scaleXData)
    .y(scaleYData)
    .curve(curveMonotoneX);

  select('.line-chart-line').attr('d', line(data));
};

/**
 * invoke functions to draw appropriate changes
 */
const renderChanges = data => {
  drawAxes();
  // drawLine(data);
};

export const initializeChart = (points, distance) => {
  buildAxes();
  // buildLine();
  // renderChanges(data);
  renderChanges(points);
};
