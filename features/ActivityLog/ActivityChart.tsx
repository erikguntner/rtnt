import React, { useState, useEffect, useRef } from 'react';
import { axisBottom, select, scalePoint, event, entries } from 'd3';
import styled from 'styled-components';
import startOfYear from 'date-fns/startOfYear';
import addWeeks from 'date-fns/addWeeks';
import startOfWeek from 'date-fns/startOfWeek';
import endOfWeek from 'date-fns/endOfWeek';
import eachDayOfInterval from 'date-fns/eachDayOfInterval';
import format from 'date-fns/format';
import isThisWeek from 'date-fns/isThisWeek';

import { Activity } from './ActivityLog';
import useResizeObserver from '../Activity/useResizeObserver';

interface ActivityChartProps {
  year: number;
  week: number;
  data: Activity[];
}

const ActivityChart: React.FC<ActivityChartProps> = ({ year, week, data }) => {
  const ref = useRef(null);
  const svgRef = useRef(null);
  const dimensions = useResizeObserver(ref);

  useEffect(() => {
    if (dimensions === null) return;
    // dimensions of graph
    const margin = { top: 20, right: 15, bottom: 20, left: 15 };
    const height = dimensions.height;
    const width = dimensions.width;
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    const svg = select(svgRef.current);

    // finding all dates in a given week
    const start = startOfYear(new Date(year, 0, 1));
    const datePlusWeeks = addWeeks(start, week - 1);
    const startDate = startOfWeek(datePlusWeeks, { weekStartsOn: 1 });
    const endDate = endOfWeek(datePlusWeeks, { weekStartsOn: 1 });
    const daysOfWeek = eachDayOfInterval({ start: startDate, end: endDate });
    // create object storing all activities for each day
    const daysData = data.reduce((accum, curr) => {
      const date = format(new Date(curr.startDate), 'L/dd');
      if (!accum.hasOwnProperty(date)) {
        accum[date] = [];
      }
      accum[date].push(curr);
      return accum;
    }, {});

    const xScale = scalePoint()
      .domain(daysOfWeek.map((date) => format(date, 'L/dd')))
      .range([0, innerWidth])
      .padding(0.5);

    const xAxis = axisBottom(xScale).ticks(daysOfWeek.length);

    svg.select('.x-axis').style('transform', 'translateY(150px)').call(xAxis);

    if (isThisWeek(startDate, { weekStartsOn: 1 })) {
      svg
        .append('polyline')
        .attr(
          'transform',
          () =>
            `translate(${xScale(format(new Date(), 'L/dd'))} ${innerHeight})`
        )
        .attr('points', '0,10 12,10 6,0 0,10')
        .style('fill', '#0070f3')
        .style('stroke-width', '2px');
    }

    const daysEntries = entries(daysData);

    const g = svg.selectAll('.day').data(daysEntries);

    // create group for each day
    const gEnter = g
      .enter()
      .append('g')
      .attr('class', 'day')
      .attr(
        'transform',
        ({ key }) => `translate(${xScale(key)} ${innerHeight - 10})`
      )
      .attr('width', xScale.bandwidth());

    // create line
    gEnter
      .append('line')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', 0)
      .attr('y2', -50)
      .style('stroke', 'black');

    // create group and add a circle for each activity
    gEnter
      .append('g')
      .attr('class', 'circle-group')
      .attr('transform', `translate(0 -57)`)
      .selectAll('.circle')
      .data(({ value }: { key: string; value: Activity[] }) => value)
      .enter()
      .append('circle')
      .attr('r', 7)
      .attr('class', 'circle')
      .style('stroke', '#0070f3')
      .style('fill', 'none')
      .style('stroke-width', '2px');
  }, [data, dimensions]);

  return (
    <ChartContainer ref={ref}>
      <svg ref={svgRef} width="100%" height="100%">
        <g className="x-axis" />
      </svg>
    </ChartContainer>
  );
};

const ChartContainer = styled.div`
  position: relative;
  width: 100%;
  height: 20rem;
  background-color: #ffff;
  z-index: 10;
`;

export default ActivityChart;
