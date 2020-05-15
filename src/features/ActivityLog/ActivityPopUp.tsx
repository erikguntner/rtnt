import React from 'react';
import styled, { css } from 'styled-components';
import format from 'date-fns/format';
import { convertLength } from '@turf/helpers';

import Portal from '../Utilities/Portal';
import { Activity, ActivityData } from './ActivityLog';
import getStateAbbreviation from '../../utils/getStateAbbreviation';

interface ActivityPopUpProps {
  activity: ActivityData;
}

const ActivityPopUp: React.FC<ActivityPopUpProps> = ({
  activity: { top, position, data },
}) => {
  return (
    <Portal selector={'#portal'}>
      {data && (
        <Container {...{ position, data, top }}>
          <div>
            <p>
              {format(new Date(data.startDate), 'MMMM d, yyyy')} {data.city},{' '}
              {getStateAbbreviation(data.state)}
            </p>
            <p>{data.name}</p>
          </div>
          <div>
            <p>
              Distance:{' '}
              {convertLength(
                parseInt(data.distance),
                'meters',
                'miles'
              ).toFixed(1)}
            </p>
            <p>Time: {data.elapsedTime}</p>
          </div>
        </Container>
      )}
    </Portal>
  );
};

// styles for triangle when menu is on top
const isTopInner = css`
  border-top: 8px solid #fff;
  bottom: -8px;
`;

const isTopOutter = css`
  border-top: 9px solid ${(props) => props.theme.colors.gray[400]};
  bottom: -9px;
`;

// styles for triangle when menu is on bottom
const isBottomInner = css`
  border-bottom: 8px solid #fff;
  top: -8px;
`;

const isBottomOutter = css`
  border-bottom: 9px solid ${(props) => props.theme.colors.gray[400]};
  top: -9px;
`;

const Container = styled.div<{
  position: number[];
  data: Activity;
  top: boolean;
}>`
  position: absolute;
  top: ${({ position }) => `${position[1]}px`};
  left: ${({ position }) => `${position[0]}px`};
  width: 20rem;
  height: min-content;
  padding: 1.6rem;
  transform: ${({ top }) =>
    top ? 'translate(-76px, -100%)' : 'translate(-76px, 0)'};
  background-color: #fff;
  pointer-events: auto;
  z-index: 1000;
  border: 1px solid ${(props) => props.theme.colors.gray[400]};

  & div:first-of-type {
    border-bottom: 1px solid ${(props) => props.theme.colors.gray[400]};

    & p:first-of-type {
      line-height: 1;
      font-size: 1.2rem;
      color: ${(props) => props.theme.colors.gray[600]};
      margin-bottom: 1rem;
    }

    & p:nth-of-type(2) {
      font-size: 1.8rem;
      color: ${(props) => props.theme.colors.primary};
      margin-bottom: 1.6rem;
    }
  }

  & div:nth-of-type(2) {
    margin-top: 1.6rem;

    & p {
      line-height: 1;
      font-size: 1.4rem;
      font-weight: 600;
      margin-bottom: 8px;
    }
  }

  &::before {
    content: '';
    position: absolute;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    ${({ top }) => (top ? isTopInner : isBottomInner)}
    left: 87px;
    z-index: 1090;
    left: 50%;
    transform: translateX(-50%);
  }

  &::after {
    position: absolute;
    content: '';
    border-left: 9px solid transparent;
    border-right: 9px solid transparent;
    ${({ top }) => (top ? isTopOutter : isBottomOutter)}
    left: 87px;
    z-index: 1089;
    left: 50%;
    transform: translateX(-50%);
  }
`;

const Tooltip = styled.article`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default ActivityPopUp;
