/* eslint-disable @typescript-eslint/ban-ts-ignore */
import React, {
  useEffect,
  useState,
  useMemo,
  useRef,
  Dispatch,
  SetStateAction,
  MutableRefObject,
} from 'react';
import styled from 'styled-components';
import ResizeObserver from 'resize-observer-polyfill';
import {
  extent,
  max,
  scaleLinear,
  line,
  area,
  select,
  curveMonotoneX,
  clientPoint,
} from 'd3';
import * as turfHelpers from '@turf/helpers';

import { createChart } from '../../../utils/d3/LineChart';
import parseElevationData from '../../../utils/parseElevationData';
import Axis from './Axis';

interface ElevationData {
  distance: number;
  elevation: number;
}
export interface Props {
  showElevation?: boolean | null;
  lines: number[][][];
  units: string;
  setDistanceAlongPath: Dispatch<SetStateAction<number | null>>;
}

interface Dimensions {
  boundedHeight: number;
  boundedWidth: number;
  height?: number;
  marginBottom: number;
  marginLeft: number;
  marginRight: number;
  marginTop: number;
  width?: number;
}

const combineChartDimensions = (
  dimensions: Partial<Dimensions>
): Dimensions => {
  const parsedDimensions = {
    ...dimensions,
    marginTop: dimensions.marginTop || 30,
    marginRight: dimensions.marginRight || 30,
    marginBottom: dimensions.marginBottom || 30,
    marginLeft: dimensions.marginLeft || 35,
  };
  return {
    ...parsedDimensions,
    boundedHeight: Math.max(
      parsedDimensions.height -
        parsedDimensions.marginTop -
        parsedDimensions.marginBottom,
      0
    ),
    boundedWidth: Math.max(
      parsedDimensions.width -
        parsedDimensions.marginLeft -
        parsedDimensions.marginRight,
      0
    ),
  };
};

const useChartDimensions = (
  passedSettings = {}
): { ref: MutableRefObject<HTMLDivElement>; newSettings: Dimensions } => {
  const ref = useRef<HTMLDivElement>();
  const dimensions = combineChartDimensions(passedSettings);

  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (dimensions.width && dimensions.height) {
      return [ref, dimensions];
    }

    const element = ref.current;

    const resizeObserver = new ResizeObserver((entries) => {
      if (!Array.isArray(entries)) return;
      if (!entries.length) return;

      const entry = entries[0];

      if (width != entry.contentRect.width) {
        setWidth(entry.contentRect.width);
      }

      if (height != entry.contentRect.height) {
        setHeight(entry.contentRect.height);
      }
    });

    resizeObserver.observe(element);

    return () => resizeObserver.unobserve(element);
  }, []);

  const newSettings = combineChartDimensions({
    ...dimensions,
    width: dimensions.width || width,
    height: dimensions.height || height,
  });

  return { ref, newSettings };
};

export const UpdatedElevationProfile: React.FC<Props> = ({
  showElevation = true,
  lines,
  units,
  setDistanceAlongPath,
}) => {
  if (!showElevation && showElevation !== null) {
    return null;
  }

  // const removePreviousChart = () => {
  //   if (containerRef.current.firstElementChild.tagName !== 'P') {
  //     containerRef.current.firstElementChild.innerHTML = '';
  //   }
  // };

  // useEffect(() => {
  //   if (dimensions === null) return;
  //   removePreviousChart();

  //   const newElevationData = parseElevationData(lines);

  //   createChart(newElevationData, setDistanceAlongPath, units, dimensions);
  // }, [lines, dimensions]);
  const { ref, newSettings: dimensions } = useChartDimensions();
  const {
    width,
    height,
    marginLeft,
    marginTop,
    boundedWidth,
    boundedHeight,
  } = dimensions;

  const yAxisUnits = units === 'miles' ? 'feet' : 'meters';
  const data = parseElevationData(lines);

  //@ts-ignore
  const xValue = (d) => turfHelpers.convertLength(d.distance, 'meters', units);
  const yValue = (d) =>
    turfHelpers.convertLength(
      d.elevation,
      'meters',
      //@ts-ignore
      yAxisUnits
    );

  const xScale = useMemo(
    () =>
      scaleLinear()
        .domain([0, max(data, xValue)])
        .range([0, boundedWidth]),
    [boundedWidth, data]
  );

  const yScale = useMemo(
    () => scaleLinear().domain(extent(data, yValue)).range([boundedHeight, 0]),
    [boundedHeight, data]
  );

  const generatedArea = area()
    .curve(curveMonotoneX)
    .x((d) => xScale(xValue(d)))
    .y0(boundedHeight)
    //@ts-ignore
    .y1((d) => yScale(yValue(d)))(data);

  const generatedLine = line()
    .x((d) => xScale(xValue(d)))
    .y((d) => yScale(yValue(d)))
    //@ts-ignore
    .curve(curveMonotoneX)(data);

  const handleMouseEnter = () => {
    select('#mouse').style('opacity', '1');
    select('#mouse-line').style('opacity', '1');
  };

  const handleMouseMove = (e) => {
    const mouseCoords = clientPoint(e.target, e);

    select('#mouse-line').attr('d', function () {
      let d = 'M' + mouseCoords[0] + ',' + boundedHeight;
      d += ' ' + mouseCoords[0] + ',' + 0;
      return d;
    });

    select('#mouse').attr('transform', () => {
      const linePath = select<SVGPathElement, unknown>('#profile');
      let beginning = 0;
      let end = linePath.node().getTotalLength();
      let pos = null;

      while (true) {
        const target = Math.floor((beginning + end) / 2);
        pos = linePath.node().getPointAtLength(target);
        console.log(pos);
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

      select('#elevation-text').text(
        `${yScale.invert(pos.y).toFixed(2)} ${elevationAbbrev}`
      );

      select('#distance-text').text(
        `${xScale.invert(pos.x).toFixed(2)} ${distanceAbbrev}`
      );

      return `translate(${mouseCoords[0]}, ${pos.y})`;
    });
  };

  const handleMouseLeave = () => {
    select('#mouse').style('opacity', '0');
    select('#mouse-line').style('opacity', '0');
    setDistanceAlongPath(0);
  };

  return (
    <ChartContainer
      {...{ showElevation }}
      className="line-chart-container"
      id="elevation-container"
      ref={ref}
    >
      <svg
        data-testid="elevation-profile"
        className="line-chart"
        width={width}
        height={height}
      >
        <g transform={`translate(${[marginLeft, marginTop].join(',')})`}>
          <rect width={boundedWidth} height={boundedHeight} fill="#f5f5f5" />
          <g
            transform={`rotate(90) translate(${[0, boundedHeight].join(',')})`}
          >
            <Axis domain={yScale.domain()} range={yScale.range()} />
          </g>
          <g transform={`translate(${[0, boundedHeight].join(',')})`}>
            <Axis domain={xScale.domain()} range={xScale.range()} />
          </g>
        </g>
        <path
          id="profile"
          transform={`translate(${[marginLeft, marginTop].join(',')})`}
          d={generatedLine}
          stroke="#0070f3"
          strokeWidth={4}
          fill="none"
        />
        <path
          transform={`translate(${[marginLeft, marginTop].join(',')})`}
          d={generatedArea}
          fill="rgba(0, 112, 243, 0.1)"
        />
        <g
          id="mouse-group"
          transform={`translate(${[marginLeft, marginTop].join(',')})`}
        >
          <path
            id="mouse-line"
            style={{ opacity: 0 }}
            strokeWidth={2}
            stroke="black"
          />
          <g id="mouse">
            <circle r={7} stroke="#fff" strokeWidth={2} fill="#444" />
            <rect
              transform={`translate(${[-20, -27].join(' ')})`}
              height={20}
              width={40}
              fill={'rgba(0, 0, 0, 0.4)'}
            />
            <text id="elevation-text" height={11} fill="white"></text>
            <text id="distance-text" height={11} fill="white"></text>
          </g>
        </g>
        <rect
          id="overlay"
          transform={`translate(${[marginLeft, marginTop].join(',')})`}
          width={boundedWidth}
          height={boundedHeight}
          fill="none"
          pointerEvents="all"
          onMouseOver={handleMouseEnter}
          onTouchStart={handleMouseEnter}
          onMouseMove={handleMouseMove}
          onTouchMove={handleMouseMove}
          onMouseOut={handleMouseLeave}
          onTouchEnd={handleMouseLeave}
        />
      </svg>
      {/* {lines.length > 0 ? (
        <svg
          data-testid="elevation-profile"
          className="line-chart"
          width={dms.width}
          height={dms.height}
        />
      ) : (
        <Text>Create a line to see the elevation chart</Text>
      )} */}
    </ChartContainer>
  );
};

const Text = styled.p`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2.4rem;
  color: ${(props) => props.theme.colors.gray[600]};

  @media screen and (max-width: ${(props) => props.theme.screens.md}) {
    font-size: 1.8rem;
  }
`;

const ChartContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #ffff;
  display: block;
  z-index: 25;
  transition: all 0.3s ease;

  .line-chart {
    border: 1px solid gold;
  }
`;
