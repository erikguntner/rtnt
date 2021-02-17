/* eslint-disable @typescript-eslint/ban-ts-ignore */
import React, { useState, useMemo, Dispatch, SetStateAction } from 'react';
import styled from 'styled-components';
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

import { useChartDimensions } from './useChartDimensions';
import parseElevationData from '../../../utils/parseElevationData';
import Axis from './Axis';

export interface Props {
  showElevation?: boolean | null;
  lines: number[][][];
  units: string;
  setDistanceAlongPath: Dispatch<SetStateAction<number | null>>;
}

const getPositionOnLine = (
  mouse: [number, number],
  selector: string
): { x: number; y: number } => {
  const line = select<SVGPathElement, unknown>(selector);

  let beginning = 0;
  let end = line.node().getTotalLength();
  let position = null;

  while (true) {
    const target = Math.floor((beginning + end) / 2);
    position = line.node().getPointAtLength(target);
    if ((target === end || target === beginning) && position.x !== mouse[0]) {
      break;
    }
    if (position.x > mouse[0]) end = target;
    else if (position.x < mouse[0]) beginning = target;
    else break; //positionition found
  }

  return { x: position.x, y: position.y };
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

  const [contentOrientation, setContentOrientation] = useState<
    'left' | 'right'
  >('left');

  const { ref, newSettings: dimensions } = useChartDimensions({
    marginLeft: 50,
  });
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
    const mouse = clientPoint(e.target, e);
    const { x, y } = getPositionOnLine(mouse, '#profile');
    const orientation: 'left' | 'right' =
      mouse[0] > boundedWidth - boundedWidth * 0.25 ? 'left' : 'right';

    select('#mouse-line').attr('d', function () {
      let d = 'M' + mouse[0] + ',' + boundedHeight;
      d += ' ' + mouse[0] + ',' + 0;
      return d;
    });

    select('#mouse').attr('transform', `translate(${mouse[0]}, ${y})`);
    select('#content').attr('transform', `translate(${mouse[0]}, ${40})`);

    const elevationAbbrev: string = units === 'miles' ? 'ft' : 'm';
    const distanceAbbrev: string = units === 'miles' ? 'mi' : 'km';

    select('#elevation-text').text(
      `${yScale.invert(y).toFixed(2)} ${elevationAbbrev}`
    );

    select('#distance-text').text(
      `${xScale.invert(x).toFixed(2)} ${distanceAbbrev}`
    );

    // set the orientation for the content if they don't currently match
    if (orientation !== contentOrientation) {
      setContentOrientation(orientation);
    }

    setDistanceAlongPath(+xScale.invert(x));
  };

  const handleMouseLeave = () => {
    select('#mouse').style('opacity', '0');
    select('#mouse-line').style('opacity', '0');
    setDistanceAlongPath(0);
  };

  // const orientation = defineOrientation();

  return (
    <ChartContainer
      {...{ showElevation }}
      className="line-chart-container"
      id="elevation-container"
      ref={ref}
    >
      {lines.length > 0 ? (
        <svg
          data-testid="elevation-profile"
          className="line-chart"
          width={width}
          height={height}
        >
          <g transform={`translate(${[marginLeft, marginTop].join(',')})`}>
            <rect width={boundedWidth} height={boundedHeight} fill="#f8f8f8" />
            <g
              style={{ transform: 'rotate(90deg)' }}
              transform={`translate(${[0, boundedHeight].join(',')})`}
            >
              <Axis domain={yScale.domain()} range={yScale.range()} axis="y" />
            </g>
            <g
              style={{ padding: '20px' }}
              transform={`translate(${[0, boundedHeight].join(',')})`}
            >
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
              style={{ opacity: 0, transition: 'opacity 0.1s ease' }}
              strokeWidth={1}
              stroke="#718096"
            />
            <g
              id="mouse"
              style={{ opacity: 0, transition: 'opacity 0.1s ease' }}
            >
              <circle r={7} stroke="#fff" strokeWidth={2} fill="#444" />
              <rect
                height={40}
                width={80}
                transform={
                  contentOrientation === 'right'
                    ? 'translate(15 -20)'
                    : 'translate(-94 -20)'
                }
                stroke="black"
                fill="#fff"
              />
              {/* `translate(-86 -5)` */}
              <text
                transform={
                  contentOrientation === 'right'
                    ? 'translate(23 -5)'
                    : 'translate(-86 -5)'
                }
                id="elevation-text"
                height={11}
              ></text>
              {/* `translate(-86 10)` */}
              <text
                transform={
                  contentOrientation === 'right'
                    ? 'translate(23 10)'
                    : 'translate(-86 10)'
                }
                id="distance-text"
                height={11}
              ></text>
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
      ) : (
        <Text>Create a line to see the elevation chart</Text>
      )}
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
  background-color: #f8f8f8;
  display: block;
  z-index: 25;
  transition: all 0.3s ease;
`;
