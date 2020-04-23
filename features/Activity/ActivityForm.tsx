import React, { useState } from 'react';
import styled from 'styled-components';
import BrushChart from './BrushChart';

interface ActivityFormProps {}

const ActivityForm: React.FC<ActivityFormProps> = ({}) => {
  const [data, setData] = useState([10, 25, 30, 40, 25, 60]);
  const onAddDataClick = () =>
    setData([...data, Math.round(Math.random() * 100)]);

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
