import React, { useEffect, useCallback, useState, useRef } from 'react';
import styled from 'styled-components';
import format from 'date-fns/format';

import WeeklyBlock from './WeeklyBlock';
import Month from './Month';
import ActivityPopUp from './ActivityPopUp';
import { InvertedLink } from '../Utilities/Button';

import API_URL from '../../utils/url';
import constructDateObject from '../../utils/constructDateObject';

export interface Activity {
  id?: number;
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

export interface ActivityData {
  top: boolean;
  position: number[];
  data: null | Activity;
  units: 'miles' | 'kilometers';
}

const ActivityLog: React.FC<{}> = ({}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isSticky, setIsSticky] = useState<boolean>(false);
  const [headerMonth, setHeaderMonth] = useState<number>(new Date().getMonth());
  const [units, setUnits] = useState<'miles' | 'kilometers'>('miles');
  const [activity, setActivity] = useState<ActivityData>({
    top: false,
    position: [],
    data: null,
    units,
  });
  const headerRef = useRef(null);
  const yearRef = useRef(null);
  // let timeline = {};

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
      } catch (error) {}
      setLoading(false);
    };

    fetchRoutes();
  }, []);

  const handleScroll = (e) => {
    if (headerRef.current) {
      const { top } = headerRef.current.getBoundingClientRect();
      if (top <= 0) {
        setIsSticky(true);
      } else if (top > 0 && isSticky === true) {
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

  const timeline = activities.length ? constructDateObject(activities) : {};

  return (
    <Center>
      <Container>
        <Header>
          <h1>Activity Log</h1>
          <InvertedLink href="/activity/create">Add activity</InvertedLink>
        </Header>
        <DateHeader ref={headerRef} {...{ isSticky }}>
          <p>{format(new Date(2020, headerMonth, 1), 'MMMM')}, 2020</p>
          <Days>
            <li>M</li>
            <li>T</li>
            <li>W</li>
            <li>T</li>
            <li>F</li>
            <li>S</li>
            <li>S</li>
          </Days>
        </DateHeader>
        {loading ? (
          <Loading>
            <h2>Loading ...</h2>
          </Loading>
        ) : (
          Object.keys(timeline).map((year) => (
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
                            setActivity={setActivity}
                            activity={activity}
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
          ))
        )}
      </Container>
      <ActivityPopUp {...{ activity }} />
    </Center>
  );
};

const Center = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
`;

const Loading = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${(props) => props.theme.colors.gray[600]};
`;

const Container = styled.div`
  display: grid;
  grid-template-columns: 90vw;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.6rem;

  @media screen and (max-width: ${(props) => props.theme.screens.md}) {
    padding: 8px 0;
  }

  h1 {
    font-size: 3.2rem;

    @media screen and (max-width: ${(props) => props.theme.screens.md}) {
      font-size: 2.4rem;
    }
  }
`;

const DateHeader = styled.div<{ isSticky: boolean }>`
  position: ${(props) => (props.isSticky ? 'sticky' : 'relative')};
  top: 0;
  left: 0;
  width: 100%;
  display: grid;
  grid-template-columns: 20% 80%;
  padding: 1.6rem 0;
  transition: box-shadow 0.2s ease;
  background-color: #fff;
  box-shadow: ${(props) =>
    props.isSticky ? props.theme.boxShadow.bottom : 'none'};
  z-index: 20;

  @media screen and (max-width: ${(props) => props.theme.screens.md}) {
    grid-template-rows: min-content min-content;
    grid-template-columns: 1fr;
    padding: 8px 0 1.6rem 0;
  }

  & p {
    text-align: center;
    font-size: 2.4rem;

    @media screen and (max-width: ${(props) => props.theme.screens.md}) {
      text-align: left;
    }
  }
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
