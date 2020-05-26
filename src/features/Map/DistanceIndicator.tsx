import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import {
  calculateDistance,
  abbreviatedDistance,
} from '../../utils/calculateDistance';

import { updateUnits } from '../Auth/authSlice';
interface Props {
  units: 'miles' | 'kilometers';
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
  const [focused, setFocused] = useState<boolean>(false);

  const handleClick = () => {
    const newUnits = units === 'miles' ? 'kilometers' : 'miles';
    dispatch(updateUnits(newUnits, authenticated));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.keyCode === 9) {
        if (document.activeElement.id === 'distance-indicator') {
          setFocused(true);
        } else {
          if (focused === true) {
            setFocused(false);
          }
        }
      } else if (e.keyCode === 13) {
        if (document.activeElement.id === 'distance-indicator') {
          handleClick();
        }
      }
    };

    window.addEventListener('keyup', handleKeyDown);

    return () => {
      window.removeEventListener('keyup', handleKeyDown);
    };
  }, [focused, handleClick]);

  useEffect(() => {
    if (lines.length > 0) {
      const lineDistance = calculateDistance(lines, units);
      setDistance(+lineDistance);
    } else {
      setDistance(0);
    }

    // setDistance(+convertedDistance);
  }, [units, lines]);

  return (
    <DistanceContainer>
      <Background />
      <Display
        {...{ focused }}
        id="distance-indicator"
        datatest-id="distance-indicator"
        tabIndex={0}
        onClick={handleClick}
      >
        <div>
          <span>{distance || 0}</span>
          <span datatest-id="distance-indicator-units">
            {abbreviatedDistance(units)}
          </span>
        </div>
        <p>click to change units</p>
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

const Display = styled.div<{ focused: boolean }>`
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  z-index: 15;
  outline: ${(props) =>
    props.focused ? props.theme.boxShadow.outline : 'none'};

  & span {
    color: #fff;
    font-size: 1.8rem;
    align-self: baseline;
    line-height: 1;

    @media screen and (max-width: 600px) {
      font-size: 1.2rem;
    }

    &:first-child {
      margin-right: 3px;
      font-size: 3.2rem;
      line-height: 1;

      @media screen and (max-width: 600px) {
        font-size: 2.4rem;
      }
    }
  }

  & p {
    font-size: 8px;
    color: #fff;
    line-height: 1;
    text-align: center;
    margin-top: 4px;
    opacity: 0.8;
  }
`;

const DistanceContainer = styled.div`
  position: absolute;
  display: flex;
  right: 1.6rem;
  bottom: 2.5rem;
  height: 5.5rem;
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
