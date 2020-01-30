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
  const handleResize = () => {
    const container = document.getElementsByClassName('line-chart');
    container[0].innerHTML = '';
    createChart();
  };

  if (!showElevation) {
    return null;
  }

  useEffect(() => {
    // initialize chart on render
    // initializeChart(lines, totalDistance);
    // render({ distance: totalDistance, elevation: [] });
    createChart();
  }, [totalDistance]);

  useEffect(() => {
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <ChartContainer
      {...{ showElevation }}
      className="line-chart-container"
      id="elevation-container"
    >
      <svg className="line-chart" width="100%" height="100%" />
    </ChartContainer>
  );
};

interface StyleProps {
  showElevation: boolean;
}

const ChartContainer = styled.div<StyleProps>`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  margin: 0 auto;
  width: 100vw;
  height: 35%;
  background-color: ${props => props.theme.colors.gray[100]};
  display: block;
  /* justify-content: center; */
  z-index: 10;
  transition: all 0.3s ease;
`;

export default ElevationProfile;
