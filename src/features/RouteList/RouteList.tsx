import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useSelector, useDispatch } from 'react-redux';
import * as turfHelpers from '@turf/helpers';
import styled from 'styled-components';
import compareAsc from 'date-fns/compareAsc';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import Slider from '@material-ui/core/Slider';
import Tooltip from '@material-ui/core/Tooltip';

import { RootState } from '../../reducers/rootReducer';
import { sportsArr, surfacesArr } from '../Utilities/Tag';

import {
  updateSortingTerm,
  updateFilter,
  removeFilter,
  getRoutes,
  Filters,
} from './routeListSlice';
import MobileFilters from './MobileFilters';
import CustomSelect from './CustomSelect';
import CardSkeleton from './CardSkeleton';
import Badges from './Badges';
import Tag from '../Utilities/Tag';

export interface Route {
  id: number;
  name: string;
  image: string;
  user_id: string;
  lines: number[][][];
  start_point: number[];
  end_point: number[];
  points: number[][];
  distance: string;
  created_at: string;
  sports: string[];
  surfaces: string[];
  city: string;
  state: string;
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface LabelProps {
  children: React.ReactElement;
  open: boolean;
  value: number;
}

const ValueLabelComponent = (props: LabelProps) => {
  const { children, open, value } = props;

  return (
    <Tooltip open={open} enterTouchDelay={0} placement="top" title={value}>
      {children}
    </Tooltip>
  );
};

const sortRoutes = (
  sortTerm: string,
  routes: Route[],
  filters: Filters,
  maxDistance: number,
  units: 'miles' | 'kilometers'
): Route[] => {
  let result = routes;
  const { keyword, range } = filters;

  if (keyword) {
    result = result.filter(
      ({ name }) => name.toLowerCase().indexOf(keyword.toLowerCase()) >= 0
    );
  }

  result = result.filter(({ distance }) => {
    const min = Math.min(range[0], range[1]);
    const max = Math.max(range[0], range[1]);
    const convertedDistance = turfHelpers
      .convertLength(parseFloat(distance), 'meters', units)
      .toFixed(1);

    return (
      parseFloat(convertedDistance) >= min &&
      parseFloat(convertedDistance) <= max
    );
  });

  if (filters.sports.length > 0) {
    result = result.filter(({ sports }) => {
      for (let i = 0; i < sports.length; i++) {
        if (filters.sports.includes(sports[i])) {
          return true;
        }
      }

      return false;
    });
  }

  if (filters.surfaces.length > 0) {
    result = result.filter(({ surfaces }) => {
      for (let i = 0; i < surfaces.length; i++) {
        if (filters.surfaces.includes(surfaces[i])) {
          return true;
        }
      }

      return false;
    });
  }

  switch (sortTerm) {
    case 'newest':
      return result.sort((a, b) =>
        compareAsc(new Date(b.created_at), new Date(a.created_at))
      );
    case 'oldest':
      return result.sort((a, b) =>
        compareAsc(new Date(a.created_at), new Date(b.created_at))
      );
    case 'shortest':
      return result.sort(
        (a, b) => parseFloat(a.distance) - parseFloat(b.distance)
      );
    case 'longest':
      return result.sort(
        (a, b) => parseFloat(b.distance) - parseFloat(a.distance)
      );
    default:
      return result;
  }
};

const RouteList: React.FC<{}> = () => {
  const MapCard = dynamic(() => import('./MapCard'), {
    ssr: false,
  });

  const {
    sortedRoutes,
    maxDistance,
    sortingTerm,
    filters,
    loading,
    user: { units },
  } = useSelector(
    ({
      routeList: { routes, sortingTerm, filters, maxDistance, loading },
      auth,
    }: RootState) => ({
      sortedRoutes: sortRoutes(
        sortingTerm,
        [...routes],
        filters,
        maxDistance,
        auth.user.units
      ),
      routes,
      maxDistance,
      sortingTerm,
      filters,
      loading,
      user: auth.user,
    })
  );
  const dispatch = useDispatch();

  const [open, setOpen] = useState<boolean>(false);

  const handleSelect = (selectedOption: SelectOption) => {
    dispatch(updateSortingTerm(selectedOption.value));
  };

  const handleChange = (filter: string, value: string) => {
    dispatch(updateFilter({ filter, value }));
  };

  const handleSlide = (
    event: React.ChangeEvent<{}>,
    newValue: number[],
    filters: Filters
  ) => {
    if (newValue[0] === filters.range[0] && newValue[1] === filters.range[1])
      return;

    dispatch(updateFilter({ filter: 'range', value: newValue }));
  };

  const handleClick = (filter: string) => dispatch(removeFilter(filter));

  const toggleTags = (filter: string, title: string, tags: string[]) => {
    let value;

    if (tags.includes(title)) {
      value = tags.filter((tag) => tag !== title);
    } else {
      value = [...tags, title];
    }

    dispatch(updateFilter({ filter, value }));
  };

  useEffect(() => {
    dispatch(getRoutes());
  }, []);

  return (
    <>
      <Layout>
        <Header>
          <Badges
            filters={filters}
            removeFilter={handleClick}
            length={sortedRoutes.length}
            units={units}
            maxDistance={maxDistance}
          />
          <SelectContainer>
            <CustomSelect {...{ sortingTerm, handleSelect }} />
          </SelectContainer>
          <FilterButton onClick={() => setOpen(true)}>filters</FilterButton>
        </Header>
        <Grid>
          <FiltersWrapper>
            <FilterGroup>
              <Label>Keyword</Label>
              <InputWrapper>
                <FontAwesomeIcon icon={faSearch} />
                <InputWithIcon
                  onChange={(e) => handleChange('keyword', e.target.value)}
                  value={filters.keyword}
                  name="keyword"
                  type="text"
                  placeholder="Filter by keyword"
                />
              </InputWrapper>
            </FilterGroup>
            <FilterGroup>
              <Label>Distance</Label>
              <InputGroup>
                <Slider
                  min={0}
                  step={0.5}
                  max={maxDistance}
                  onChange={(
                    event: React.ChangeEvent<{}>,
                    newValue: number[]
                  ) => handleSlide(event, newValue, filters)}
                  value={[filters.range[0], filters.range[1]]}
                  ValueLabelComponent={ValueLabelComponent}
                />
              </InputGroup>
            </FilterGroup>
            <FilterGroup>
              <Label>Sports</Label>
              <TagsWrapper>
                {sportsArr.map((sport, i) => (
                  <Tag
                    key={i}
                    options={filters.sports}
                    title={sport}
                    handleClick={() =>
                      toggleTags('sports', sport, filters.sports)
                    }
                  />
                ))}
              </TagsWrapper>
            </FilterGroup>
            <FilterGroup>
              <Label>Surface</Label>
              <TagsWrapper>
                {surfacesArr.map((surface, i) => (
                  <Tag
                    key={i}
                    options={filters.surfaces}
                    title={surface}
                    handleClick={() =>
                      toggleTags('surfaces', surface, filters.surfaces)
                    }
                  />
                ))}
              </TagsWrapper>
            </FilterGroup>
          </FiltersWrapper>
          <RouteGrid>
            {loading ? (
              <>
                {Array.from(Array(10), (_, i) => (
                  <CardSkeleton key={i} />
                ))}
              </>
            ) : (
              <>
                {sortedRoutes.length ? (
                  sortedRoutes.map((route) => (
                    <MapCard key={route.id} route={route} />
                  ))
                ) : (
                  <h2>No Routes</h2>
                )}
              </>
            )}
          </RouteGrid>
        </Grid>
      </Layout>
      <MobileFilters
        {...{
          open,
          setOpen,
          handleChange,
          filters,
          sortingTerm,
          handleSelect,
          maxDistance,
          toggleTags,
          handleSlide,
          ValueLabelComponent,
        }}
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
  align-items: center;
  /* overflow: hidden; */
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
  margin-bottom: 2.4rem;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 2.4rem;
  overflow: scroll;
  justify-content: center;

  @media screen and (max-width: 1050px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media screen and (max-width: ${(props) => props.theme.screens.sm}) {
    grid-template-columns: 1fr;
  }
`;

export const FiltersWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 2.4rem;
  background-color: #fff;
  overflow: scroll;

  @media screen and (max-width: ${(props) => props.theme.screens.md}) {
    display: none;
  }
`;

export const FilterGroup = styled.div`
  width: 100%;
  margin-bottom: 2.4rem;

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

export const TagsWrapper = styled.div`
  display: flex;
`;

export const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;

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

export default RouteList;
