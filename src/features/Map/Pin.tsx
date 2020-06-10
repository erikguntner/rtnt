import React from 'react';
import styled from 'styled-components';

interface Props {
  index: number;
  points: number[][];
}

const Pin: React.FC<Props> = ({ index, points }) => {
  return <Marker index={index} coordinates={points}></Marker>;
};

interface MarkerProps {
  readonly index: number;
  readonly coordinates: number[][];
}

const Marker = styled.div<MarkerProps>`
  height: 11px;
  width: 11px;
  border-radius: 50%;
  background-color: ${(props) => {
    if (props.index === 0) {
      return props.theme.colors.green[400];
    } else if (props.index === props.coordinates.length - 1) {
      return props.theme.colors.red[600];
    } else {
      return props.theme.colors.indigo[700];
    }
  }};
  border: 1px solid black;
  transform: translate3d(-50%, -50%, 0) scale(1);
  transition: all 0.2s linear;

  &:hover {
    transform: translate3d(-50%, -50%, 0) scale(1.1);
    box-shadow: ${(props) => props.theme.boxShadow.md};
  }
`;

export default Pin;
