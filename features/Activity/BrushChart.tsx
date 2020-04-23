import React, { useEffect, useState, useRef } from 'react';
import {
  brushX,
  axisBottom,
  scaleLinear,
  scaleBand,
  extent,
  select,
  scaleTime,
  timeHour,
  max,
  event,
} from 'd3';
import styled from 'styled-components';
import { renderBrushChart } from '../../utils/d3/brushChart';
import useResizeObserver from './useResizeObserver';
import usePrevious from './usePrevious';
import getHours from 'date-fns/getHours';
import startOfTomorrow from 'date-fns/startOfTomorrow';
import startOfToday from 'date-fns/startOfToday';
import startOfDay from 'date-fns/startOfDay';
import differenceInSeconds from 'date-fns/differenceInSeconds';
import format from 'date-fns/format';

interface ElevationData {
  distance: number;
  elevation: number;
}
interface Props {
  handleBrush: (time: string, startTime: string) => void;
}

interface Dimensions {
  width: number;
  height: number;
}

const BrushChart: React.FC<Props> = ({ handleBrush }) => {
  const containerRef = useRef<HTMLDivElement>();
  const svgRef = useRef();
  const dimensions = useResizeObserver(containerRef);
  const [selection, setSelection] = useState([0, 0]);
  const previousSelection = usePrevious(selection);

  const convertToHours = (seconds) => {
    const date = new Date(null);
    date.setSeconds(seconds);
    return date.toISOString().substr(11, 8);
  };

  useEffect(() => {
    if (dimensions === null) return;

    const margin = { top: 20, right: 20, bottom: 20, left: 20 };
    const height = dimensions.height;
    const width = dimensions.width;
    const svg = select('.brush-chart');
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const xScale = scaleTime()
      .domain([startOfToday(), startOfTomorrow()])
      .range([0, innerWidth]);

    const xAxis = svg
      .select('.x-axis')
      .call(axisBottom(xScale).ticks(timeHour.every(3)))
      .attr(
        'transform',
        `translate(${margin.left} ${innerHeight + margin.top})`
      );

    const brushG = svg
      .select('.brush')
      .attr('transform', `translate(${margin.left} ${margin.top - 1})`);

    const brush = brushX()
      .extent([
        [0, 0],
        [innerWidth, innerHeight],
      ])
      .on('start brush end', () => {
        if (event.selection) {
          const [startTime, endTime] = event.selection.map(xScale.invert);
          console.log(startTime, endTime);
          const formatted = format(startTime, 'p');
          const seconds = differenceInSeconds(endTime, startTime);
          const hours = convertToHours(seconds);

          // const difference = getDifference(start, end);
          setSelection([startTime, endTime]);

          handleBrush(hours, formatted);
        }
      });

    if (previousSelection === selection) {
      brushG.call(brush).call(brush.move, selection.map(xScale));
    }
  }, [dimensions, previousSelection, selection]);

  return (
    <>
      <ChartContainer id="brush-container" ref={containerRef}>
        <svg ref={svgRef} className="brush-chart" width="100%" height="100%">
          <g className="x-axis" />
          <g className="brush" />
        </svg>
      </ChartContainer>
    </>
  );
};

const ChartContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: block;
  z-index: 25;
  transition: all 0.3s ease;
`;

export default BrushChart;
