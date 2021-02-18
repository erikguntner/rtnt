import React, { useEffect, useRef } from 'react';
import { brushX, axisBottom, select, scaleTime, timeHour } from 'd3';
import styled from 'styled-components';
import useResizeObserver from './useResizeObserver';
import usePrevious from './usePrevious';
import startOfDay from 'date-fns/startOfDay';
import differenceInSeconds from 'date-fns/differenceInSeconds';
import add from 'date-fns/add';
import isEqual from 'date-fns/isEqual';

interface ElevationData {
  distance: number;
  elevation: number;
}
interface Props {
  setElapsedAndStartTime: (time: number, startTime: string) => void;
  date: Date;
  selection: Date[];
  setSelection: React.Dispatch<React.SetStateAction<Date[]>>;
  previousSelection: Date[];
}

interface Dimensions {
  width: number;
  height: number;
}

const BrushChart: React.FC<Props> = ({
  setElapsedAndStartTime,
  date,
  selection,
  setSelection,
  previousSelection,
}) => {
  const containerRef = useRef<HTMLDivElement>();
  const svgRef = useRef();
  const dimensions = useResizeObserver(containerRef);
  const previousDimensions = usePrevious(dimensions);
  const previousDate = usePrevious(date);

  useEffect(() => {
    if (dimensions === null) return;

    const margin = { top: 20, right: 15, bottom: 20, left: 15 };
    const height = dimensions.height;
    const width = dimensions.width;
    const svg = select('.brush-chart');
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    const startDate = add(startOfDay(date), { hours: 5 });
    const endDate = startOfDay(add(date, { days: 1 }));

    const xScale = scaleTime()
      .domain([startDate, endDate])
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
      .on('start brush end', ({ selection }) => {
        if (selection) {
          const [startTime, endTime] = selection.map(xScale.invert);
          const seconds = differenceInSeconds(endTime, startTime);
          setSelection([startTime, endTime]);
          setElapsedAndStartTime(seconds, startTime);
        }
      });

    // Update brush when dates change
    if (!isEqual(date, previousDate)) {
      brushG.call(brush).call(brush.move, selection.map(xScale));
    }

    if (previousSelection === selection) {
      brushG.call(brush).call(brush.move, selection.map(xScale));
    }

    if (dimensions !== previousDimensions) {
      brushG.call(brush).call(brush.move, selection.map(xScale));
    }
  }, [
    dimensions,
    previousDimensions,
    previousSelection,
    selection,
    previousDate,
    date,
  ]);

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
