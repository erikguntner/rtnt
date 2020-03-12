import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import Select from 'react-select';
import compareAsc from 'date-fns/compareAsc';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

import { RootState } from '../../app/rootReducer';
import { updateSortingTerm, updateFilter } from './routeListSlice';
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
  price: {
    min: number | null;
    max: number | null;
  };
}

const sortRoutes = (
  sortTerm: string,
  routes: RouteI[],
  filters: Filters
): RouteI[] => {
  let result = routes;

  if (filters.keyword) {
    console.log('filtering by', filters.keyword);
    result = result.filter(
      ({ name }) =>
        name.toLowerCase().indexOf(filters.keyword.toLowerCase()) >= 0
    );
  }

  if (filters.price.min || filters.price.max) {
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
  container: provided => ({
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

  const handleSelectChange = selectedOption => {
    dispatch(updateSortingTerm(selectedOption.value));
  };

  const handleChange = (filter, value) => {
    dispatch(updateFilter({ filter, value }));
  };

  const renderBadges = filters => {
    return Object.keys(filters).map(filter => {
      if (filter === 'keyword' && filters.keyword) {
        return <Badge>Keyword: {filters.keyword}</Badge>;
      }
    });
  };

  return (
    <Layout>
      <Header>
        <Badges>
          <p>{sortedRoutes.length} routes</p>
          {renderBadges(filters)}
        </Badges>
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
          defaultValue={options.filter(option => option.value === sortingTerm)}
          {...{ options }}
          onChange={handleSelectChange}
        />
      </Header>
      <Grid>
        <Filters>
          <FilterGroup>
            <Label>Keyword</Label>
            <InputWrapper>
              <FontAwesomeIcon icon={faSearch} />
              <InputWithIcon
                onChange={e => handleChange('keyword', e.target.value)}
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
                onChange={e =>
                  handleChange('price/min', parseInt(e.target.value))
                }
              />
              <Input
                type="number"
                placeholder="Max"
                onChange={e =>
                  handleChange('price/max', parseInt(e.target.value))
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
  height: calc(100vh - ${props => props.theme.navHeight});
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: min-content 1fr;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 2.4rem;
  background-color: #fff;
  box-shadow: ${props => props.theme.boxShadow.sm};
  z-index: 10;
`;

const Badges = styled.div`
  display: flex;
  align-items: center;

  & > p {
    font-size: 1.2rem;
  }
`;

const Badge = styled.div`
  padding: 4px 6px;
  font-size: 1.4rem;
  border: 1px solid ${props => props.theme.colors.teal[800]};
  border-radius: 2px;
  color: ${props => props.theme.colors.teal[800]};
  background-color: ${props => props.theme.colors.teal[200]};
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
  color: ${props => props.theme.colors.gray[900]};
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
    color: ${props => props.theme.colors.gray[600]};
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

const InputWithIcon = styled(Input)`
  padding: 1rem 1rem 1rem 3.6rem;
`;

export default RouteList;
