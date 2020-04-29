import React from 'react';
import styled from 'styled-components';

// interface CrossHairsProps {}

const CrossHairs: React.FC<{}> = ({}) => {
  return (
    <Border>
      <Circle />
    </Border>
  );
};

const Border = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: calc(100% - 64px);
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px solid ${(props) => props.theme.colors.primary};
`;

const Circle = styled.div`
  border: 2px solid ${(props) => props.theme.colors.primary};
  height: 5rem;
  width: 5rem;
  border-radius: 50%;
`;

export default CrossHairs;
