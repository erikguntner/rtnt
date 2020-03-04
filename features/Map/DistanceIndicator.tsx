import React, { useState, useEffect, Dispatch, SetStateAction } from 'react';
import styled from 'styled-components';
import * as turfHelpers from '@turf/helpers';

interface ElevationData {
  distance: number;
  segDistance: number;
  elevation: number;
}

interface Props {
  elevationData: ElevationData[][];
  units: string;
  setUnits: Dispatch<SetStateAction<string>>;
}

const calculateDistance = (data, units) => {
  const arrLength = data[data.length - 1].length;
  const distance = data[data.length - 1][arrLength - 1].distance;
  return turfHelpers.convertLength(distance, 'meters', units).toFixed(1);
};

const DistanceIndicator: React.FC<Props> = ({
  elevationData,
  units,
  setUnits,
}) => {
  const [distance, setDistance] = useState<number>(0);

  const handleClick = () => {
    setUnits(() => (units === 'miles' ? 'kilometers' : 'miles'));
  };

  const abbreviatedDistance = units => {
    if (units === 'miles') {
      return 'mi';
    } else {
      return 'km';
    }
  };

  useEffect(() => {
    const convertedDistance =
      elevationData.length === 0 ? 0 : calculateDistance(elevationData, units);

    setDistance(+convertedDistance);
  }, [elevationData, units]);

  return (
    <DistanceContainer>
      <Background />
      <Display onClick={handleClick}>
        <span>{distance || 0}</span>
        <span>{abbreviatedDistance(units)}</span>
      </Display>
    </DistanceContainer>
  );
};

const Background = styled.div`
  position: absolute;
  display: block;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background-color: #333;
  opacity: 0.9;
  border-radius: 3px;
  z-index: 10;
`;

const Display = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  z-index: 15;

  & > span {
    color: #fff;
    font-size: 1.8rem;
    align-self: baseline;

    @media screen and (max-width: 600px) {
      font-size: 1.2rem;
    }

    &:first-child {
      margin-right: 3px;
      font-size: 3.2rem;

      @media screen and (max-width: 600px) {
        font-size: 2.4rem;
      }
    }
  }
`;

const DistanceContainer = styled.div`
  position: absolute;
  display: flex;
  right: 1.6rem;
  bottom: 2.5rem;
  height: 5rem;
  width: 10rem;
  border-radius: 3px;

  @media screen and (max-width: 600px) {
    height: 4rem;
    width: 8rem;
    right: 1.2rem;
    bottom: 1.2rem;
  }
`;

export default DistanceIndicator;
