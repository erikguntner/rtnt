import React, { useState, useEffect, useRef } from 'react';
import { axisBottom, select, scalePoint, event, entries, easeBounce } from 'd3';
import styled from 'styled-components';
import startOfYear from 'date-fns/startOfYear';
import addWeeks from 'date-fns/addWeeks';
import startOfWeek from 'date-fns/startOfWeek';
import endOfWeek from 'date-fns/endOfWeek';
import eachDayOfInterval from 'date-fns/eachDayOfInterval';
import format from 'date-fns/format';
import isThisWeek from 'date-fns/isThisWeek';
import { convertLength } from '@turf/helpers';

import { Activity } from './ActivityLog';
import useResizeObserver from '../Activity/useResizeObserver';

interface ActivityChartProps {
  units: 'miles' | 'kilometers';
  year: number;
  week: number;
  data: Activity[];
}

const ActivityChart: React.FC<ActivityChartProps> = ({
  units,
  year,
  week,
  data,
}) => {
  const ref = useRef(null);
  const svgRef = useRef(null);
  const dimensions = useResizeObserver(ref);

  useEffect(() => {
    if (dimensions === null) return;
    // constants
    const margin = { top: 20, right: 1, bottom: 20, left: 0 };
    const height = dimensions.height;
    const width = dimensions.width;
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    const svg = select(svgRef.current);
    const circleRadius = 24;
    const lineHeight = 50;
    const animationDuration = 400;
    // define transitions deepending on how many activities were done in the day
    const transitions = {
      2: [
        [circleRadius * -1, 0],
        [circleRadius, 0],
      ],
    };

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
            `translate(${xScale(format(new Date(), 'L/dd')) - 5} ${
              innerHeight + 10
            })`
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

    gEnter
      .append('text')
      .text(({ value }: { key: string; value: Activity[] }) =>
        value.length > 1 ? `+ ${value.length - 1}` : ''
      )
      .attr('text-anchor', 'middle')
      .attr('transform', `translate(0 -${circleRadius * 2 + lineHeight + 10})`)
      .style('font-size', '12px')
      .style('opacity', '1');

    // create line
    gEnter
      .append('line')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', 0)
      .attr('y2', -50)
      .style('stroke', 'black');

    // animation for updating text opacity
    const changeTextOpacity = (element: Element, opacity: number) => {
      select(element)
        .transition()
        .style('opacity', opacity)
        .duration(animationDuration);
    };

    // defines necessary elements for animations
    const defineElements = (svg: SVGElement) => ({
      childNodeCount: svg.childElementCount,
      children: svg.children,
      numberText: svg.parentElement.firstElementChild,
    });

    // create group for all circles
    const circleGroup = gEnter
      .append('g')
      .attr('class', 'circle-group')
      .attr('transform', `translate(0 ${-50 - circleRadius})`)
      .on('mouseenter', function () {
        const { childNodeCount, children, numberText } = defineElements(this);

        if (childNodeCount === 1) return;
        else {
          changeTextOpacity(numberText, 0);

          // loop over the transition vales based on number of child elements
          // and apply them to the corresponding svg element
          transitions[childNodeCount].forEach(([tranX, tranY], i) => {
            const childNode = select(children[i]);
            childNode
              .transition()
              .attr('transform', `translate(${tranX} ${tranY})`)
              .duration(animationDuration);
          });
        }
      })
      .on('mouseleave', function () {
        const { childNodeCount, children, numberText } = defineElements(this);

        if (childNodeCount === 1) return;
        else {
          changeTextOpacity(numberText, 1);

          // loop over children and return to starting position
          Array.from(children).forEach((element) => {
            const childNode = select(element);
            childNode
              .transition()
              .attr('transform', `translate(0 0)`)
              .duration(animationDuration);
          });
        }
      });

    const leafGroup = circleGroup
      .selectAll('.leaf-group')
      .data(({ value }: { key: string; value: Activity[] }) => value)
      .enter()
      .append('g')
      .attr('transform', `translate(0 0)`)
      .attr('class', 'leaf-group');

    // create each circle
    leafGroup
      .append('circle')
      .attr('r', circleRadius)
      .attr('class', 'circle')
      .style('stroke', '#4c51bf')
      .style('fill', '#ebf4ff')
      .style('stroke-width', '1px');

    // add distance text to each leaf
    leafGroup
      .append('text')
      .text((d) =>
        convertLength(parseInt(d.distance), 'meters', units).toFixed(1)
      )
      .attr('text-anchor', 'middle')
      .attr('transform', `translate(0 5)`)
      .style('font-size', '16px');
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
