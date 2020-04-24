import React, { useEffect, useRef } from 'react';
import { brushX, axisBottom, select, scaleTime, timeHour, event } from 'd3';
import styled from 'styled-components';
import useResizeObserver from './useResizeObserver';
import usePrevious from './usePrevious';
import startOfDay from 'date-fns/startOfDay';
import differenceInSeconds from 'date-fns/differenceInSeconds';
import format from 'date-fns/format';
import add from 'date-fns/add';
import isEqual from 'date-fns/isEqual';

interface ElevationData {
  distance: number;
  elevation: number;
}
interface Props {
  handleBrush: (time: string, startTime: string) => void;
  date: Date;
  selection: any;
  setSelection: any;
  previousSelection: any;
}

interface Dimensions {
  width: number;
  height: number;
}

const BrushChart: React.FC<Props> = ({
  handleBrush,
  date,
  selection,
  setSelection,
  previousSelection,
}) => {
  const containerRef = useRef<HTMLDivElement>();
  const svgRef = useRef();
  const dimensions = useResizeObserver(containerRef);
  const previousDimensions = usePrevious(dimensions);
  // const [selection, setSelection] = useState<any>([0, 0]);
  // const previousSelection = usePrevious(selection);
  const previousDate = usePrevious(date);

  const convertToHours = (seconds) => {
    const date = new Date(null);
    date.setSeconds(seconds);
    return date.toISOString().substr(11, 8);
  };

  useEffect(() => {
    if (dimensions === null || previousDimensions === undefined) return;

    const margin = { top: 20, right: 15, bottom: 20, left: 15 };
    const height = dimensions.height;
    const width = dimensions.width;
    const svg = select('.brush-chart');
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    const startDate = startOfDay(date);
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
      .on('start brush end', () => {
        if (event.selection) {
          const [startTime, endTime] = event.selection.map(xScale.invert);
          const formatted = format(startTime, 'p');
          const seconds = differenceInSeconds(endTime, startTime);
          const hours = convertToHours(seconds);

          setSelection([startTime, endTime]);

          handleBrush(hours, formatted);
        }
      });

    if (!isEqual(date, previousDate)) {
      brushG.call(brush).call(brush.move, selection.map(xScale));
    }

    if (previousSelection === selection) {
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
