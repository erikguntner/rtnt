import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import Select from 'react-select';
import compareAsc from 'date-fns/compareAsc';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

import { RootState } from '../../app/rootReducer';
import {
  updateSortingTerm,
  updateFilter,
  removeFilter,
} from './routeListSlice';
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

interface Filters {
  keyword: string;
  distance: {
    min: number;
    max: number;
  };
}

const renderDistance = ({ min, max }: { min: number; max: number }): string => {
  let string = '';
  if (min === max) {
    string = `${min}`;
  } else if (max > min && min <= 0) {
    string = `${max} & Less`;
  } else if (min > max && max >= 0) {
    string = `${min} & Greater`;
  } else if (max > min) {
    string = `${min} - ${max}`;
  }

  return string;
};

const sortRoutes = (
  sortTerm: string,
  routes: RouteI[],
  filters: Filters
): RouteI[] => {
  let result = routes;
  const { keyword, distance } = filters;

  if (keyword) {
    result = result.filter(
      ({ name }) => name.toLowerCase().indexOf(keyword.toLowerCase()) >= 0
    );
  }

  if (distance.min || distance.max) {
    if (distance.min === distance.max) {
      result = result.filter(
        ({ total_distance }) =>
          total_distance[total_distance.length - 1] === distance.min
      );
    } else if (distance.min > distance.max) {
      result = result.filter(
        ({ total_distance }) =>
          total_distance[total_distance.length - 1] >= distance.min
      );
    } else if (distance.min < distance.max) {
      result = result.filter(
        ({ total_distance }) =>
          total_distance[total_distance.length - 1] >= distance.min &&
          total_distance[total_distance.length - 1] <= distance.max
      );
    }
  }

  switch (sortTerm) {
    case 'newest':
      return result.sort((a, b) =>
        compareAsc(new Date(b.created_on), new Date(a.created_on))
      );
    case 'oldest':
      return result.sort((a, b) =>
        compareAsc(new Date(a.created_on), new Date(b.created_on))
      );
    case 'shortest':
      return result.sort(
        (a, b) =>
          a.total_distance[a.total_distance.length - 1] -
          b.total_distance[b.total_distance.length - 1]
      );
    case 'longest':
      return result.sort(
        (a, b) =>
          b.total_distance[b.total_distance.length - 1] -
          a.total_distance[a.total_distance.length - 1]
      );
    default:
      return result;
  }
};

const options = [
  { value: 'newest', label: 'Sort By: Newest' },
  { value: 'oldest', label: 'Sort By: Oldest' },
  { value: 'shortest', label: 'Sort By: Shortest' },
  { value: 'longest', label: 'Sort By: Longest' },
];

const customStyles = {
  container: (provided) => ({
    ...provided,
    width: '300px',
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.04)',
    fontSize: '14px',
  }),
};

const RouteList: React.FC<{}> = () => {
  const { sortedRoutes, sortingTerm, filters } = useSelector(
    (state: RootState) => ({
      sortedRoutes: sortRoutes(
        state.routeList.sortingTerm,
        [...state.routeList.routes],
        state.routeList.filters
      ),
      sortingTerm: state.routeList.sortingTerm,
      filters: state.routeList.filters,
    })
  );

  const dispatch = useDispatch();

  const handleSelect = (selectedOption) => {
    dispatch(updateSortingTerm(selectedOption));
  };

  const handleChange = (filter, value) => {
    if (filter === 'keyword') {
      dispatch(updateFilter({ filter, value }));
    } else {
      // const restrictedValues = ['-', '.', '+', 'e'];
      // const indexOfRestrictedValue = -1;

      // for(let i = )

      // make it so the input will not accept '-, e, +, or .'
      dispatch(updateFilter({ filter, value }));
    }
  };

  const renderBadges = (filters) => {
    return Object.keys(filters).map((filter) => {
      if (filter === 'keyword' && filters.keyword) {
        return (
          <Badge key={filter} onClick={() => dispatch(removeFilter(filter))}>
            Keyword: {filters.keyword} X
          </Badge>
        );
      } else if (
        filter === 'distance' &&
        (filters.distance.min > 0 || filters.distance.max > 0)
      ) {
        return (
          <Badge key={filter} onClick={() => dispatch(removeFilter(filter))}>
            Distance: {renderDistance(filters.distance)} X
          </Badge>
        );
      }
    });
  };

  console.log(filters);

  return (
    <Layout>
      <Header>
        <Badges>
          <p>{sortedRoutes.length} routes</p>
          {renderBadges(filters)}
        </Badges>
        <Select
          styles={customStyles}
          theme={(theme) => ({
            ...theme,
            borderRadius: 2,
            colors: {
              ...theme.colors,
              primary: '#4c51bf',
            },
          })}
          defaultValue={options.filter(
            (option) => option.value === sortingTerm
          )}
          {...{ options }}
          onChange={handleSelect}
        />
      </Header>
      <Grid>
        <Filters>
          <FilterGroup>
            <Label>Keyword</Label>
            <InputWrapper>
              <FontAwesomeIcon icon={faSearch} />
              <InputWithIcon
                onChange={(e) => handleChange('keyword', e.target.value)}
                value={filters.keyword}
                type="text"
                placeholder="Filter by keyword"
              />
            </InputWrapper>
          </FilterGroup>
          <FilterGroup>
            <Label>Distance</Label>
            <InputGroup>
              <Input
                type="number"
                placeholder="Min"
                value={filters.distance.min}
                onChange={(e) =>
                  handleChange('distance/min', e.target.value || 0)
                }
              />
              <Input
                type="number"
                placeholder="Max"
                value={filters.distance.max}
                onChange={(e) =>
                  handleChange('distance/max', e.target.value || 0)
                }
              />
            </InputGroup>
          </FilterGroup>
        </Filters>
        <RouteGrid>
          {sortedRoutes.length
            ? sortedRoutes.map(
                ({ id, name, image, total_distance: totalDistance }) => (
                  <RouteCard key={id} {...{ id, name, image, totalDistance }} />
                )
              )
            : 'No Routes to Display'}
        </RouteGrid>
      </Grid>
    </Layout>
  );
};

const Layout = styled.div`
  height: calc(100vh - ${(props) => props.theme.navHeight});
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: min-content 1fr;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 2.4rem;
  background-color: #fff;
  box-shadow: ${(props) => props.theme.boxShadow.sm};
  z-index: 10;
`;

const Badges = styled.div`
  display: flex;
  align-items: center;

  &:hover {
    cursor: pointer;
  }

  & > p {
    margin-right: 1rem;
    font-size: 1.4rem;
    font-style: italic;
  }

  & > div:not(:last-child) {
    margin-right: 6px;
  }
`;

const Badge = styled.div`
  padding: 4px 6px;
  font-size: 1.4rem;
  border: 1px solid ${(props) => props.theme.colors.teal[800]};
  border-radius: 2px;
  color: ${(props) => props.theme.colors.teal[800]};
  background-color: ${(props) => props.theme.colors.teal[200]};
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 300px 1fr;
  grid-template-rows: 1fr;
  overflow: scroll;
`;

const RouteGrid = styled.div`
  display: grid;
  padding: 2.4rem;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 2.4rem;
  overflow: scroll;
`;

const Filters = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 2.4rem;
  background-color: #fff;
`;

const FilterGroup = styled.div`
  width: 100%;
`;

const Label = styled.div`
  margin-bottom: 8px;
  font-size: 1.4rem;
  font-weight: 600;
  color: ${(props) => props.theme.colors.gray[900]};
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: 2.4rem;

  svg {
    position: absolute;
    font-size: 1.4rem;
    color: ${(props) => props.theme.colors.gray[600]};
    z-index: 20;
    transform: translateX(1.1rem);
  }
`;

const InputGroup = styled.div`
  display: flex;

  & > input {
    &:not(:last-child) {
      margin-right: 1rem;
    }
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem 1rem 1rem 1rem;
  background-color: #fff;
  border: 1px solid ${(props) => props.theme.colors.gray[400]};
  border-radius: 2px;
  font-size: 1.4rem;
  box-shadow: ${(props) => props.theme.boxShadow.sm};
  color: ${(props) => props.theme.colors.gray[900]};

  &:focus {
    outline: none;
    box-shadow: ${(props) => props.theme.boxShadow.outline};
    background-color: #fff;
  }
`;

const InputWithIcon = styled(Input)`
  padding: 1rem 1rem 1rem 3.6rem;
`;

export default RouteList;
