import React from 'react';
import styled from 'styled-components';

interface Props {
  index: number;
  points: number[][];
}

const Pin: React.FC<Props> = ({ index, points }) => {
  return (
    <SVG index={index} coordinates={points} width="11" height="11">
      <circle cx="50%" cy="50%" r="5" />
    </SVG>
  );
};

interface SVGProps {
  readonly index: number;
  readonly coordinates: number[][];
}

const SVG = styled.svg<SVGProps>`
  transform: translate3d(-50%, -50%, 0);

  circle {
    fill: ${props => {
      if (props.index === 0) {
        return props.theme.colors.green[400];
      } else if (props.index === props.coordinates.length - 1) {
        return props.theme.colors.red[600];
      } else {
        return props.theme.colors.indigo[700];
      }
    }};
    stroke: black;
  }
`;

export default Pin;
