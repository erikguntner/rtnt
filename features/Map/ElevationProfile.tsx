import React, { useEffect, Dispatch, SetStateAction } from 'react';
import styled from 'styled-components';
import d3Config from '../../utils/d3/config';
import { createChart } from '../../utils/d3/utils';
import { lineSegment } from '@turf/turf';

interface ElevationData {
  distance: number;
  elevation: number;
}
interface Props {
  showElevation: boolean;
  totalDistance: number[];
  lines: number[][][];
  elevationData: ElevationData[][];
  setDistanceAlongPath: Dispatch<SetStateAction<number | null>>;
}

const ElevationProfile: React.FC<Props> = ({
  showElevation,
  totalDistance,
  lines,
  elevationData,
  setDistanceAlongPath,
}) => {
  const handleResize = () => {
    const container = document.getElementsByClassName('line-chart');
    if (container.length > 0) {
      container[0].innerHTML = '';
      createChart(elevationData, setDistanceAlongPath);
    }
  };

  if (!showElevation) {
    return null;
  }

  useEffect(() => {
    const container = document.getElementsByClassName('line-chart');
    if (container.length > 0) {
      container[0].innerHTML = '';
      createChart(elevationData, setDistanceAlongPath);
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
      {lines.length > 0 ? (
        <svg className="line-chart" width="100%" height="100%" />
      ) : (
        <div>Create a line to see the elvation chart</div>
      )}
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
