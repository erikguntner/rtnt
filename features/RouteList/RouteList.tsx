import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import Select from 'react-select';
import compareAsc from 'date-fns/compareAsc';

import { RootState } from '../../app/rootReducer';
import { updateFilterTerm } from './routeListSlice';
import RouteCard from './RouteCard';
interface ElevationData {
  distance: number;
  segDistance: number;
  elevation: number;
}

interface RouteI {
  id: number;
  name: string;
  image: string;
  points: number[][];
  lines: number[][][];
  total_distance: number[];
  elevation_data: ElevationData[][];
  created_on: string;
}

const filterRoutes = (filterTerm: string, routes: RouteI[]): RouteI[] => {
  switch (filterTerm) {
    case 'most recent':
      return routes.sort((a, b) =>
        compareAsc(new Date(b.created_on), new Date(a.created_on))
      );
    case 'oldest':
      return routes.sort((a, b) =>
        compareAsc(new Date(a.created_on), new Date(b.created_on))
      );
    case 'shortest':
      return routes.sort(
        (a, b) =>
          a.total_distance[a.total_distance.length - 1] -
          b.total_distance[b.total_distance.length - 1]
      );
    case 'longest':
      return routes.sort(
        (a, b) =>
          b.total_distance[b.total_distance.length - 1] -
          a.total_distance[a.total_distance.length - 1]
      );
    default:
      return routes;
  }
};

const options = [
  { value: 'most recent', label: 'Most Recent' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'shortest', label: 'Shortest' },
  { value: 'longest', label: 'Longest' },
];

const RouteList: React.FC<{}> = () => {
  const { filteredRoutes, filter } = useSelector((state: RootState) => ({
    filteredRoutes: filterRoutes(state.routeList.filter, [
      ...state.routeList.routes,
    ]),
    filter: state.routeList.filter,
  }));

  const dispatch = useDispatch();

  const handleChange = selectedOption => {
    dispatch(updateFilterTerm(selectedOption.value));
  };

  return (
    <div>
      <Select
        defaultValue={options.filter(option => option.value === filter)}
        {...{ options }}
        onChange={handleChange}
      />
      <Grid>
        {filteredRoutes.length &&
          filteredRoutes.map(
            ({ id, name, image, total_distance: totalDistance }) => (
              <RouteCard key={id} {...{ id, name, image, totalDistance }} />
            )
          )}
      </Grid>
    </div>
  );
};

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 3.6rem;
  margin: 3.6rem;
`;

export default RouteList;
