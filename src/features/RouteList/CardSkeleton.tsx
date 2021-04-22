import React from 'react';
import styled from 'styled-components';
import Skeleton from '../Utilities/Skeleton';

const CardSkeleton = () => {
  return (
    <SkeletonWrapper>
      <Skeleton height={'100%'} width={'100%'} borderRadius={'8px'} />
    </SkeletonWrapper>
  );
};

const SkeletonWrapper = styled.article`
  height: 100%;
  width: 100%;

  div {
    margin-bottom: 8px;
  }
`;

export default CardSkeleton;
