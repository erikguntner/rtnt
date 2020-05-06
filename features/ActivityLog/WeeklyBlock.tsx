import React from 'react';
import styled from 'styled-components';
import startOfYear from 'date-fns/startOfYear';
import addWeeks from 'date-fns/addWeeks';
import startOfWeek from 'date-fns/startOfWeek';
import endOfWeek from 'date-fns/endOfWeek';
import format from 'date-fns/format';

import ActivityChart from './ActivityChart';
import { Activity } from './ActivityLog';

interface WeeklyBlockProps {
  year: number;
  week: number;
  data: Activity[];
}

const WeeklyBlock: React.FC<WeeklyBlockProps> = ({ year, week, data }) => {
  const start = startOfYear(new Date(year, 0, 1));
  const datePlusWeeks = addWeeks(start, week - 1);
  const startDate = format(
    startOfWeek(datePlusWeeks, { weekStartsOn: 1 }),
    'L/dd'
  );
  const endDate = format(endOfWeek(datePlusWeeks, { weekStartsOn: 1 }), 'L/dd');

  const totalDistance = data.reduce((accum, curr) => {
    return (accum += parseInt(curr.distance));
  }, 0);

  return (
    <Block>
      <Details>
        <DateText>
          {startDate} - {endDate}
        </DateText>
        <Distance>{totalDistance}</Distance>
      </Details>
      <ActivityChart {...{ year, week, data }} />
    </Block>
  );
};

const Details = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const DateText = styled.p`
  font-size: 1.2rem;
  font-weight: 700;
`;

const Distance = styled.p`
  font-size: 3.2rem;
`;

const Block = styled.article`
  display: grid;
  grid-template-columns: 20rem 70rem;
`;

export default WeeklyBlock;
