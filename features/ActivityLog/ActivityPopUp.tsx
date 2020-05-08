import React from 'react';
import styled from 'styled-components';
import format from 'date-fns/format';
import { convertLength } from '@turf/helpers';

import Portal from '../Utilities/Portal';
import { Activity } from './ActivityLog';
import getStateAbbreviation from '../../utils/getStateAbbreviation';

interface ActivityPopUpProps {
  position: number[];
  activity: Activity;
}

const WIDTH = 200;

const ActivityPopUp: React.FC<ActivityPopUpProps> = ({
  position,
  activity,
}) => {
  return (
    <Portal selector={'#portal'}>
      {activity && (
        <Container {...{ position, activity }}>
          <div>
            <p>
              {format(new Date(activity.startDate), 'MMMM d, yyyy')}{' '}
              {activity.city}, {getStateAbbreviation(activity.state)}
            </p>
            <p>{activity.name}</p>
          </div>
          <div>
            <p>
              Distance:{' '}
              {convertLength(
                parseInt(activity.distance),
                'meters',
                'miles'
              ).toFixed(1)}
            </p>
            <p>Time: {activity.elapsedTime}</p>
          </div>
        </Container>
      )}
    </Portal>
  );
};
const Container = styled.div<{ position: number[]; activity: null | Activity }>`
  position: absolute;
  top: ${({ position }) => `${position[1]}px`};
  left: ${({ position }) => `${position[0]}px`};
  width: 20rem;
  height: min-content;
  padding: 1.6rem;
  transform: translate(-76px, 0);
  background-color: #fff;
  pointer-events: auto;
  opacity: ${({ activity }) => (activity ? '1' : '0')};
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
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-bottom: 8px solid #fff;
    position: absolute;
    left: 87px;
    top: -8px;
    z-index: 1090;
    left: 50%;
    transform: translateX(-50%);
  }

  &::after {
    content: '';
    border-left: 9px solid transparent;
    border-right: 9px solid transparent;
    border-bottom: 9px solid ${(props) => props.theme.colors.gray[400]};
    position: absolute;
    left: 87px;
    top: -9px;
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
