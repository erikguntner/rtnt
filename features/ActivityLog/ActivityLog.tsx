import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';

import ActivityChart from './ActivityChart';
import WeeklyBlock from './WeeklyBlock';
import Month from './Month';
import format from 'date-fns/format';

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
  const [headerMonth, setHeaderMonth] = useState<number>(new Date().getMonth());
  const [units, setUnits] = useState<'miles' | 'kilometers'>('miles');
  const headerRef = useRef(null);
  const yearRef = useRef(null);

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
          setUnits(units);
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
    <Center>
      <Container>
        <Header ref={headerRef} {...{ isSticky }}>
          <HeaderDate>
            {format(new Date(2020, headerMonth, 1), 'MMMM')}, 2020
          </HeaderDate>
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
          <div ref={yearRef} key={year} id={year}>
            {Object.keys(timeline[year])
              .reverse()
              .map((month) => (
                <Month
                  key={`${year}-${month}`}
                  {...{ year, month, headerMonth, setHeaderMonth }}
                >
                  {Object.keys(timeline[year][month])
                    .reverse()
                    .map((week) => (
                      <div
                        key={`${year}-${month}-${week}`}
                        id={`${year}-${month}-${week}`}
                      >
                        <WeeklyBlock
                          units={units}
                          year={parseInt(year)}
                          week={parseInt(week)}
                          data={timeline[year][month][week].reverse()}
                        />
                      </div>
                    ))}
                </Month>
              ))}
          </div>
        ))}
      </Container>
    </Center>
  );
};

const Center = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
`;

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
  padding: 1.6rem 0;
  transition: box-shadow 0.2s ease;
  background-color: #fff;
  box-shadow: ${(props) =>
    props.isSticky ? props.theme.boxShadow.bottom : 'none'};
  z-index: 20;
`;

const HeaderDate = styled.p`
  text-align: center;
  font-size: 2.4rem;
`;

const Days = styled.ul`
  display: flex;
  justify-content: space-around;
  align-items: center;

  & li {
    font-size: 1.2rem;
    list-style: none;
  }
`;

export default ActivityLog;
