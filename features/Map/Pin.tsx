import React from 'react';
import styled from 'styled-components';

interface Props {
  index: number;
  size: number;
}

const pinStyle = {
  fill: '#d00',
  stroke: 'black',
};

const Pin: React.FC<Props> = ({ size = 20, index }) => {
  return (
    <SVG {...{ index }} width="11" height="11">
      <circle cx="50%" cy="50%" r="5" />
    </SVG>
  );
};

const SVG = styled.svg`
  transform: translate3d(-50%, -50%, 0);

  circle {
    fill: #4c51bf;
    stroke: black;
  }
`;

export default Pin;
