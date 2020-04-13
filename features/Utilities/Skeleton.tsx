import React from 'react';
import styled, { keyframes } from 'styled-components';

interface SkeletonProps {
  height?: string;
  width?: string;
  borderRadius?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({
  height = '16px',
  width = '16px',
  borderRadius = '2px',
}) => {
  return (
    <SkeletonWrapper
      style={{
        height: `${height}`,
        width: `${width}`,
        borderRadius: `${borderRadius}`,
      }}
    ></SkeletonWrapper>
  );
};

export default Skeleton;

const skeletonAnimation = keyframes`
  0% {
    opacity: 0.7;
  }
  50% {
    opacity: 0.3;
  }
  100% {
    opacity: 0.7;
  }
`;

const SkeletonWrapper = styled.div`
  color: #bdc3c7;
  background-color: #bdc3c7;
  border-color: #bdc3c7;
  animation-name: ${skeletonAnimation};
  animation-duration: 1.5s;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
`;
