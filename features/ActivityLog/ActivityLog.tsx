import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import ActivityChart from './ActivityChart';

import API_URL from '../../utils/url';
import constructDateObject from '../../utils/constructDateObject';

export interface Activity {
  startDate: Date;
  name: string;
  distance: string;
  elapsedTime: number;
  startPoint: number[];
  endPoint: number[];
  image: string;
  city: string;
  state: string;
}

const ActivityLog: React.FC<{}> = ({}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    const fetchRoutes = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/api/activity`, {
          method: 'GET',
          credentials: 'include',
        });

        if (response.ok) {
          const { activities, units } = await response.json();
          setActivities(activities);
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    fetchRoutes();
  }, []);

  if (activities.length === 0) {
    return <h1>There are no activies</h1>;
  }

  const timeline = constructDateObject(activities);

  return (
    <Container>
      {Object.keys(timeline).map((year) => (
        <div key={year} id={year}>
          {Object.keys(timeline[year])
            .reverse()
            .map((month) => (
              <div key={`${year}-${month}`} id={`${year}-${month}`}>
                {Object.keys(timeline[year][month])
                  .reverse()
                  .map((week) => (
                    <div
                      key={`${year}-${month}-${week}`}
                      id={`${year}-${month}-${week}`}
                    >
                      <ActivityChart
                        year={parseInt(year)}
                        week={parseInt(week)}
                        data={timeline[year][month][week].reverse()}
                      />
                    </div>
                  ))}
              </div>
            ))}
        </div>
      ))}
    </Container>
  );
};

const Container = styled.div`
  display: grid;
  grid-template-columns: 700px;
  margin: 0 auto;
`;

export default ActivityLog;
