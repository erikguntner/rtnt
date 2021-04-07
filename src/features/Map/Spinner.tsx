import React from 'react';
import styled from 'styled-components';

const Spinner = () => {
  return (
    <Wrapper>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: inline-block;
  position: relative;
  width: 2.4rem;
  height: 2.4rem;

  & div {
    box-sizing: border-box;
    display: block;
    position: absolute;
    width: 2.4rem;
    height: 2.4rem;
    margin: 4px;
    border: 4px solid ${(props) => props.theme.colors.primary};
    border-radius: 50%;
    animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
    border-color: ${(props) => props.theme.colors.primary} transparent
      transparent transparent;
  }

  & div:nth-child(1) {
    animation-delay: -0.45s;
  }
  & div:nth-child(2) {
    animation-delay: -0.3s;
  }
  & div:nth-child(3) {
    animation-delay: -0.15s;
  }
  @keyframes lds-ring {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

export default Spinner;
