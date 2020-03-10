import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import Select from 'react-select';
import compareAsc from 'date-fns/compareAsc';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

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
    case 'newest':
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
  { value: 'newest', label: 'Sort By: Newest' },
  { value: 'oldest', label: 'Sort By: Oldest' },
  { value: 'shortest', label: 'Sort By: Shortest' },
  { value: 'longest', label: 'Sort By: Longest' },
];

const customStyles = {
  container: provided => ({
    ...provided,
    width: '300px',
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.04)',
  }),
};

const RouteList: React.FC<{}> = () => {
  const { filteredRoutes, filter } = useSelector((state: RootState) => ({
    filteredRoutes: filterRoutes(state.routeList.filter, [
      ...state.routeList.routes,
    ]),
    filter: state.routeList.filter,
  }));

  const dispatch = useDispatch();

  const handleSelectChange = selectedOption => {
    dispatch(updateFilterTerm(selectedOption.value));
  };

  const handleChange = e => {
    console.log(e.target.value);
  };

  return (
    <div>
      <Header>
        <Select
          styles={customStyles}
          theme={theme => ({
            ...theme,
            borderRadius: 2,
            colors: {
              ...theme.colors,
              primary: '#4c51bf',
            },
          })}
          defaultValue={options.filter(option => option.value === filter)}
          {...{ options }}
          onChange={handleSelectChange}
        />
        <InputWrapper>
          <FontAwesomeIcon icon={faSearch} />
          <Input onChange={handleChange} type="text" placeholder="Search" />
        </InputWrapper>
      </Header>
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

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 2.4rem;
  background-color: #fff;
  box-shadow: ${props => props.theme.boxShadow.sm};
`;

const Grid = styled.div`
  display: grid;
  padding: 2.4rem;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 3.6rem;
`;

const InputWrapper = styled.div`
  display: flex;
  align-items: center;

  svg {
    font-size: 1.4rem;
    color: ${props => props.theme.colors.gray[600]};
    z-index: 20;
  }
`;

const Input = styled.input`
  width: 30rem;
  height: 100%;
  margin-left: -2.7rem;
  padding-left: 3.6rem;
  background-color: #fff;
  border: 1px solid ${props => props.theme.colors.gray[400]};
  border-radius: 2px;
  font-size: 1.4rem;
  box-shadow: ${props => props.theme.boxShadow.sm};
  color: ${props => props.theme.colors.gray[900]};

  &:focus {
    outline: none;
    box-shadow: ${props => props.theme.boxShadow.outline};
    background-color: #fff;
  }
`;

export default RouteList;
