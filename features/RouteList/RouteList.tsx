import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import compareAsc from 'date-fns/compareAsc';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

import { RootState } from '../../app/rootReducer';
import API_URL from '../../utils/url';
import { addRoutes } from './routeListSlice';

import {
  updateSortingTerm,
  updateFilter,
  removeFilter,
} from './routeListSlice';
import RouteCard from './RouteCard';
import MobileFilters from './MobileFilters';
import CustomSelect from './CustomSelect';
import Skeleton from '../Utilities/Skeleton';

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

export interface FiltersTypes {
  keyword: string;
  distance: {
    min: number;
    max: number;
  };
}

export interface SelectOption {
  value: string;
  label: string;
}

const CardSkeleton = () => {
  return (
    <SkeletonWrapper>
      <Skeleton height={200} width={300} />
      <Skeleton height={24} width={150} />
      <Skeleton width={50} />
    </SkeletonWrapper>
  );
};

const SkeletonWrapper = styled.article`
  height: 100%;
  width: 100%;

  div {
    margin-bottom: 8px;
  }
`;

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
  filters: FiltersTypes
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

const RouteList: React.FC<{}> = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const {
    sortedRoutes,
    sortingTerm,
    filters,
    user: { units },
  } = useSelector((state: RootState) => ({
    sortedRoutes: sortRoutes(
      state.routeList.sortingTerm,
      [...state.routeList.routes],
      state.routeList.filters
    ),
    sortingTerm: state.routeList.sortingTerm,
    filters: state.routeList.filters,
    user: state.auth.user,
    authenticated: state.auth.authenticated,
  }));
  const dispatch = useDispatch();

  const handleSelect = (selectedOption: SelectOption) => {
    dispatch(updateSortingTerm(selectedOption.value));
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

  useEffect(() => {
    const fetchRoutes = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/api/routes`, {
          method: 'GET',
          credentials: 'include',
        });

        if (response.ok) {
          const { routes } = await response.json();
          dispatch(addRoutes(routes));
        }
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };

    fetchRoutes();
  }, []);

  return (
    <>
      <Layout>
        <Header>
          <Badges>
            <p>{sortedRoutes.length} routes</p>
            {renderBadges(filters)}
          </Badges>
          <SelectContainer>
            <CustomSelect {...{ sortingTerm, handleSelect }} />
          </SelectContainer>
          <FilterButton onClick={() => setOpen(true)}>filters</FilterButton>
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
            {loading ? (
              <>
                {Array.from(Array(10), (_, i) => (
                  <CardSkeleton key={i} />
                ))}
              </>
            ) : (
              <>
                {sortedRoutes.map(
                  ({ id, name, image, elevation_data: elevationData }) => (
                    <RouteCard
                      key={id}
                      {...{ id, name, image, elevationData, units }}
                    />
                  )
                )}
              </>
            )}
          </RouteGrid>
        </Grid>
      </Layout>
      <MobileFilters
        {...{ open, setOpen, handleChange, filters, sortingTerm, handleSelect }}
      />
    </>
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
  padding: 1.6rem;
  background-color: #fff;
  box-shadow: ${(props) => props.theme.boxShadow.sm};
  z-index: 10;
`;

const SelectContainer = styled.div`
  width: 300px;
  border-radius: 2px;

  @media screen and (max-width: ${(props) => props.theme.screens.md}) {
    display: none;
  }
`;

const FilterButton = styled.button`
  display: none;
  padding: 8px 1.2rem;
  margin-right: 1rem;
  border: 1px solid ${(props) => props.theme.colors.gray[400]};
  border-radius: 2px;
  background-color: #fff;
  font-size: 1.4rem;
  box-shadow: ${(props) => props.theme.boxShadow.sm};

  @media screen and (max-width: ${(props) => props.theme.screens.md}) {
    display: flex;
  }

  &:hover {
    cursor: pointer;
    border: 1px solid ${(props) => props.theme.colors.gray[900]};
    box-shadow: ${(props) => props.theme.boxShadow.md};
  }
`;

const Badges = styled.div`
  display: flex;
  align-items: center;

  /* @media screen and (max-width: ${(props) => props.theme.screens.md}) {
    display: none;
  } */

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

  &:hover {
    cursor: pointer;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 300px 1fr;
  grid-template-rows: 1fr;
  overflow: scroll;

  @media screen and (max-width: ${(props) => props.theme.screens.md}) {
    grid-template-columns: 1fr;
  }
`;

const RouteGrid = styled.div`
  display: grid;
  padding: 2.4rem;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 2.4rem;
  overflow: scroll;
  justify-content: center;

  @media screen and (max-width: 1050px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media screen and (max-width: ${(props) => props.theme.screens.sm}) {
    grid-template-columns: 300px;
  }
`;

export const Filters = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 2.4rem;
  background-color: #fff;

  @media screen and (max-width: ${(props) => props.theme.screens.md}) {
    display: none;
  }
`;

export const FilterGroup = styled.div`
  width: 100%;

  @media screen and (max-width: ${(props) => props.theme.screens.md}) {
    width: 75%;
  }

  @media screen and (max-width: ${(props) => props.theme.screens.sm}) {
    width: 90%;
  }
`;

export const Label = styled.div`
  margin-bottom: 8px;
  font-size: 1.4rem;
  font-weight: 600;
  color: ${(props) => props.theme.colors.gray[900]};
`;

export const InputWrapper = styled.div`
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

export const InputGroup = styled.div`
  display: flex;

  & > input {
    &:not(:last-child) {
      margin-right: 1rem;
    }
  }
`;

export const Input = styled.input`
  width: 100%;
  padding: 1rem 1rem 1rem 1rem;
  background-color: #fff;
  border: 1px solid ${(props) => props.theme.colors.gray[400]};
  border-radius: 2px;
  font-size: 1.6rem;
  box-shadow: ${(props) => props.theme.boxShadow.sm};
  color: ${(props) => props.theme.colors.gray[900]};

  &:focus {
    outline: none;
    box-shadow: ${(props) => props.theme.boxShadow.outline};
    background-color: #fff;
  }
`;

export const InputWithIcon = styled(Input)`
  padding: 1rem 1rem 1rem 3.6rem;
`;

const Text = styled.p`
  width: 100%;
  margin-top: 5rem;
  color: ${(props) => props.theme.colors.gray[600]};
  font-size: 2.4rem;
  text-align: center;
`;

export default RouteList;
