import React, { useState } from 'react';
import styled from 'styled-components';
import BrushChart from './BrushChart';

interface ActivityFormProps {}

const ActivityForm: React.FC<ActivityFormProps> = ({}) => {
  return (
    <ChartContainer>
      <BrushChart />
    </ChartContainer>
  );
};

const ChartContainer = styled.div`
  height: 200px;
  width: 75%;
`;

export default ActivityForm;
