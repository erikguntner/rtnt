import React from 'react';
import styled, { keyframes } from 'styled-components';

interface Props {}

const LoadingIndicator: React.FC<Props> = () => {
  return (
    <Container>
      <Circle />
    </Container>
  );
};

const Container = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  right: 2.5rem;
  top: 8rem;
  height: 4rem;
  width: 4rem;
  background-color: ${props => props.theme.colors.gray[100]};
  border-radius: 3px;
  box-shadow: ${props => props.theme.boxShadow.md};

  @media screen and (max-width: ${props => props.theme.screens.md}) {
    top: initial;
    right: initial;
    bottom: 1.2rem;
    left: 1.2rem;
  }
`;

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;

const Circle = styled.div`
  display: block;
  height: 3rem;
  width: 3rem;
  border-radius: 50%;
  border-right: 3px solid ${props => props.theme.colors.indigo[600]};
  border-left: 3px solid ${props => props.theme.colors.indigo[300]};
  border-top: 3px solid ${props => props.theme.colors.indigo[300]};
  border-bottom: 3px solid ${props => props.theme.colors.indigo[300]};
  animation: ${rotate} 2s ease-in-out infinite;
`;

export default LoadingIndicator;
