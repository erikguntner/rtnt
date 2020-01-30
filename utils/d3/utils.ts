import {
  axisLeft,
  axisBottom,
  format,
  scaleLinear,
  scaleBand,
  extent,
  select,
  selectAll,
  curveMonotoneX,
  bisector,
  curveBasis,
  line,
  mouse,
  csv,
  max,
} from 'd3';

import { popData, lineData } from './mockData';

interface Data {
  distance: number;
  elevation: number;
}

export const renderLineChart = (data: Data[]) => {
  const margin = { top: 20, right: 20, bottom: 20, left: 100 };
  const svg = select('.line-chart');
  const newWidth = document
    .querySelector('.line-chart-container')
    .getBoundingClientRect();
  console.log(newWidth);
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
    .curve(curveBasis);

  const linePath = g
    .append('path')
    .attr('class', 'line-path')
    .attr('fill', 'none')
    .attr('stroke', '#000')
    //@ts-ignore
    .attr('d', lineGenerator(data));

  // black vertical line to follow mouse
  var mouseG = svg.append('g');
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
    .selectAll('.mouse')
    .data(data)
    .enter()
    .append('g')
    .attr('class', 'mouse');

  mouseOnLine
    .append('circle')
    .attr('r', 7)
    .style('stroke', 'black')
    .style('fill', 'none')
    .style('stroke-width', '1px')
    .style('opacity', '0');

  mouseOnLine
    .append('text')
    .attr('transform', 'translate(10,3)')
    .attr('class', 'distance-text');
  mouseOnLine
    .append('text')
    .attr('transform', 'translate(10,10)')
    .attr('class', 'elevation-text');

  mouseG
    .append('svg:rect') // append a rect to catch mouse movements on canvas
    .attr('width', innerWidth) // can't catch mouse events on a g element
    .attr('height', innerHeight)
    .attr('fill', 'none')
    .attr('pointer-events', 'all')
    .on('mouseout', function() {
      // on mouse out hide line, circles and text
      select('.mouse-line').style('opacity', '0');
      select('.mouse circle').style('opacity', '0');
      selectAll('.mouse text').style('opacity', '0');
    })
    .on('mouseover', function() {
      // on mouse in show line, circles and text
      select('.mouse-line').style('opacity', '1');
      select('.mouse circle').style('opacity', '1');
      selectAll('.mouse text').style('opacity', '1');
    })
    .on('mousemove', function() {
      // mouse moving over canvas
      //@ts-ignore
      const mouseCoords = mouse(this);
      select('.mouse-line').attr('d', function() {
        let d = 'M' + mouseCoords[0] + ',' + height;
        d += ' ' + mouseCoords[0] + ',' + 0;
        return d;
      });

      select('.mouse').attr('transform', function(d: Data[]) {
        const distances = lineData.map(obj => obj.distance);

        const xDistance = xScale.invert(mouseCoords[0]);
        const bisect = bisector(xValue).right;
        const idx = bisect(distances, xDistance);

        let beginning = 0;
        let end = linePath.node().getTotalLength();
        let pos = null;
        const target = null;

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

        select(this)
          .select('.elevation-text')
          .text(yScale.invert(pos.y).toFixed(1));

        select(this)
          .select('.distance-text')
          .text(xScale.invert(pos.x).toFixed(1));

        return `translate(${mouseCoords[0]},${pos.y})`;
      });
    });
};

export const createChart = () => {
  // renderBarChart(popData);
  renderLineChart(lineData);
};

// invoke functions to draw appropriate changes
// const renderChanges = (points, distance) => {
//   drawAxes(points, distance);
//   // drawLine(data);
// };

// export const initializeChart = (points, distance) => {
//   buildAxes();
//   // buildLine();
//   // renderChanges(data);
//   renderChanges(points, distance);
// };

interface BarData {
  country: string;
  population: number;
}

// Bar Chart
export const renderBarChart = (data: BarData[]) => {
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
