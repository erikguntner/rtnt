import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import * as turfHelpers from '@turf/helpers';
import length from '@turf/length';
import {
  calculateDistance,
  abbreviatedDistance,
} from '../../utils/calculateDistance';

import { updateUnits } from '../Auth/authSlice';

interface ElevationData {
  distance: number;
  segDistance: number;
  elevation: number;
}

interface Props {
  units: turfHelpers.Units;
  authenticated: string;
  lines: number[][][];
}

const DistanceIndicator: React.FC<Props> = ({
  units,
  authenticated,
  lines,
}) => {
  const [distance, setDistance] = useState<number>(0);
  const dispatch = useDispatch();

  const handleClick = () => {
    const newUnits = units === 'miles' ? 'kilometers' : 'miles';
    dispatch(updateUnits(newUnits, authenticated));
  };

  useEffect(() => {
    if (lines.length > 0) {
      const lineString = turfHelpers.lineString(lines.flat());

      const lineDistance = length(lineString, { units }).toFixed(1);

      setDistance(+lineDistance);
    } else {
      setDistance(0);
    }

    // setDistance(+convertedDistance);
  }, [units, lines]);

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
