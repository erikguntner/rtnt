import React, { useEffect } from 'react';
import styled from 'styled-components';
import d3Config from '../../utils/d3/config';
import { createChart } from '../../utils/d3/utils';

interface ElevationData {
  distance: number;
  elevation: number;
}
interface Props {
  showElevation: boolean;
  totalDistance: number;
  elevationData: ElevationData[][];
}

const ElevationProfile: React.FC<Props> = ({
  showElevation,
  totalDistance,
  elevationData,
}) => {
  const handleResize = () => {
    const container = document.getElementsByClassName('line-chart');
    if (container.length > 0) {
      container[0].innerHTML = '';
      createChart(elevationData);
    }
  };

  if (!showElevation) {
    return null;
  }

  useEffect(() => {
    const container = document.getElementsByClassName('line-chart');
    if (container.length > 0) {
      container[0].innerHTML = '';
      createChart(elevationData);
    }
  }, [elevationData]);

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
  z-index: 10;
  transition: all 0.3s ease;
`;

export default ElevationProfile;
