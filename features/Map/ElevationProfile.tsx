import React, { useEffect } from 'react';
import styled from 'styled-components';
import d3Config from '../../utils/d3/config';
import { initializeChart } from '../../utils/d3/utils';
import {
  axisLeft,
  axisBottom,
  format,
  timeFormat,
  scaleTime,
  scaleLinear,
} from 'd3';

interface Props {
  showElevation: boolean;
  lines: number[][][];
  totalDistance: number;
}

const ElevationProfile: React.FC<Props> = ({
  showElevation,
  lines,
  totalDistance,
}) => {
  useEffect(() => {
    // initialize chart on render
    initializeChart(lines, totalDistance);

    return () => {};
  }, []);

  return (
    <ElevationGraph {...{ showElevation }}>
      <svg className="line-chart" width="100%" height="100%" />
    </ElevationGraph>
  );
};

{
  /* <ResponsiveContainer>
  <LineChart
    data={data}
    margin={{
      top: 10,
      right: 30,
      left: 0,
      bottom: 0,
    }}
  >
    <XAxis dataKey="name" />
    <YAxis />
    <Tooltip />
    <Area type="monotone" dataKey="uv" stroke="#8884d8" fill="#8884d8" />
  </LineChart>
</ResponsiveContainer> */
}

interface StyleProps {
  showElevation: boolean;
}

const ElevationGraph = styled.div<StyleProps>`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  margin: 0 auto;
  width: 100vw;
  height: 35%;
  background-color: ${props => props.theme.colors.gray[100]};
  display: flex;
  justify-content: center;
  z-index: 10;
  transform: ${props =>
    props.showElevation ? 'translateY(0)' : 'translateY(100%)'};
  transition: all 0.3s ease;
`;

export default ElevationProfile;
