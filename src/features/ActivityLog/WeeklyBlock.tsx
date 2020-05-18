import React from 'react';
import styled from 'styled-components';
import startOfYear from 'date-fns/startOfYear';
import addWeeks from 'date-fns/addWeeks';
import startOfWeek from 'date-fns/startOfWeek';
import endOfWeek from 'date-fns/endOfWeek';
import format from 'date-fns/format';
import { convertLength } from '@turf/helpers';

import ActivityChart from './ActivityChart';
import { Activity, ActivityData } from './ActivityLog';
import { formatTime } from '../../utils/formatTime';

interface WeeklyBlockProps {
  setActivity: React.Dispatch<React.SetStateAction<null | ActivityData>>;
  activity: null | ActivityData;
  units: 'miles' | 'kilometers';
  year: number;
  week: number;
  data: Activity[];
}

const WeeklyBlock: React.FC<WeeklyBlockProps> = ({
  setActivity,
  activity,
  units,
  year,
  week,
  data,
}) => {
  const start = startOfYear(new Date(year, 0, 1));
  const datePlusWeeks = addWeeks(start, week - 1);
  const startDate = format(
    startOfWeek(datePlusWeeks, { weekStartsOn: 1 }),
    'L/dd'
  );
  const endDate = format(endOfWeek(datePlusWeeks, { weekStartsOn: 1 }), 'L/dd');

  const { totalDistance, totalTime } = data.reduce(
    (accum, curr) => {
      accum.totalDistance += parseInt(curr.distance);
      accum.totalTime += curr.elapsedTime;
      return accum;
    },
    { totalDistance: 0, totalTime: 0 }
  );

  const [hrs, mins] = formatTime(totalTime);
  return (
    <Block>
      <Details>
        <DateText>
          {startDate} - {endDate}
        </DateText>
        <DateText>
          {hrs}hr {mins}min
        </DateText>
        <Distance>
          {convertLength(totalDistance, 'meters', units).toFixed(1)}
        </Distance>
      </Details>
      <ActivityChart {...{ setActivity, activity, units, year, week, data }} />
    </Block>
  );
};

const Details = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  @media screen and (max-width: ${(props) => props.theme.screens.md}) {
    flex-direction: row-reverse;
    justify-content: flex-end;
    align-items: flex-end;
  }

  p {
    margin-right: 0;

    @media screen and (max-width: ${(props) => props.theme.screens.md}) {
      margin-right: 1.6rem;
    }
  }
`;

const DateText = styled.p`
  font-size: 1.2rem;
  font-weight: 700;
`;

const Distance = styled.p`
  font-size: 3.2rem;

  @media screen and (max-width: ${(props) => props.theme.screens.md}) {
    font-size: 2.4rem;
    line-height: 1;
  }
`;

const Block = styled.article`
  display: grid;
  grid-template-columns: 20% 80%;

  @media screen and (max-width: ${(props) => props.theme.screens.md}) {
    grid-template-rows: min-content min-content;
    grid-template-columns: 1fr;
  }
`;

export default WeeklyBlock;
