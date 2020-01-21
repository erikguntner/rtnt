import React from 'react';
import styled from 'styled-components';

interface Props {
  size: number;
}

const pinStyle = {
  fill: '#d00',
  stroke: 'black',
};

const Pin: React.FC<Props> = ({ size = 20 }) => {
  return (
    <SVG width="11" height="11">
      <circle cx="50%" cy="50%" r="5" style={pinStyle} />
    </SVG>
  );
};

const SVG = styled.svg`
  transform: translate3d(-50%, -50%, 0);
`;

export default Pin;
