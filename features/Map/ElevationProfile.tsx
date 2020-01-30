import React, { useEffect } from 'react';
import styled from 'styled-components';
import d3Config from '../../utils/d3/config';
import { createChart } from '../../utils/d3/utils';

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
    // initializeChart(lines, totalDistance);
    // render({ distance: totalDistance, elevation: [] });
    createChart();

    return () => {};
  }, [totalDistance]);

  return (
    <ElevationGraph {...{ showElevation }} className="line-chart-container">
      <svg className="line-chart" width="600" height="200" />
    </ElevationGraph>
  );
};

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
