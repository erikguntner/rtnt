import React, { useEffect, Dispatch, SetStateAction } from 'react';
import styled from 'styled-components';
import { createChart } from '../../utils/d3/utils';
import { lineSegment } from '@turf/turf';

interface ElevationData {
  distance: number;
  elevation: number;
}
interface Props {
  showElevation: boolean;
  lines: number[][][];
  elevationData: ElevationData[][];
  units: string;
  setDistanceAlongPath: Dispatch<SetStateAction<number | null>>;
}

const ElevationProfile: React.FC<Props> = ({
  showElevation,
  lines,
  elevationData,
  units,
  setDistanceAlongPath,
}) => {
  const handleResize = () => {
    const container = document.getElementsByClassName('line-chart');
    if (container.length > 0) {
      container[0].innerHTML = '';
      createChart(elevationData, setDistanceAlongPath, units);
    }
  };

  if (!showElevation) {
    return null;
  }

  useEffect(() => {
    const container = document.getElementsByClassName('line-chart');
    if (container.length > 0) {
      container[0].innerHTML = '';
      createChart(elevationData, setDistanceAlongPath, units);
    }
  }, [elevationData]);

  // trying to pass elevationData into useEffect so that resize reflects updated data
  useEffect(() => {
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [elevationData]);

  return (
    <ChartContainer
      {...{ showElevation }}
      className="line-chart-container"
      id="elevation-container"
    >
      {lines.length > 0 ? (
        <svg className="line-chart" width="100%" height="100%" />
      ) : (
        <Text>Create a line to see the elvation chart</Text>
      )}
    </ChartContainer>
  );
};

interface StyleProps {
  showElevation: boolean;
}

const Text = styled.p`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2.4rem;
  color: ${props => props.theme.colors.gray[600]};
`;

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
  z-index: 25;
  transition: all 0.3s ease;
`;

export default ElevationProfile;
