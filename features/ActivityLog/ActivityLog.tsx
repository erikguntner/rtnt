import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';

import ActivityChart from './ActivityChart';
import WeeklyBlock from './WeeklyBlock';

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
  const [isSticky, setIsSticky] = useState<boolean>(false);
  const headerRef = useRef(null);

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

  const handleScroll = (e) => {
    if (headerRef) {
      if (window.scrollY >= 65) {
        setIsSticky(true);
      } else if (window.scrollY < 65 && isSticky === true) {
        setIsSticky(false);
      }
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isSticky]);

  if (activities.length === 0) {
    return <h1>There are no activies</h1>;
  }

  const timeline = constructDateObject(activities);

  return (
    <Container>
      <Header ref={headerRef} {...{ isSticky }}>
        <Month>May, 2020</Month>
        <Days>
          <li>M</li>
          <li>T</li>
          <li>W</li>
          <li>T</li>
          <li>F</li>
          <li>S</li>
          <li>S</li>
        </Days>
      </Header>
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
                      <WeeklyBlock
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
  grid-template-columns: 900px;
  margin: 0 auto;
`;

const Header = styled.div<{ isSticky: boolean }>`
  position: ${(props) => (props.isSticky ? 'sticky' : 'relative')};
  top: 0;
  left: 0;
  width: 100%;
  display: grid;
  grid-template-columns: 20rem 70rem;
  background-color: #fff;
  padding: 1.6rem 0;
  z-index: 20;
`;

const Month = styled.p`
  text-align: center;
  font-size: 2.4rem;
`;

const Days = styled.ul`
  display: flex;
  justify-content: space-around;

  & li {
    list-style: none;
  }
`;

export default ActivityLog;
