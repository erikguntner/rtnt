import React from 'react';
import styled from 'styled-components';
import { Filters } from './routeListSlice';

interface BadgesProps {
  filters: Filters;
  removeFilter: (filter: string) => void;
  length: number;
  units: 'miles' | 'kilometers';
  maxDistance: number;
}

const renderDistance = (
  min: number,
  max: number,
  maxDistance: number,
  units: string
): string => {
  const abbrevUnits = units === 'miles' ? 'mi' : 'km';

  if (min === max) {
    return `${min}${abbrevUnits}`;
  } else if (min > 0 && max < maxDistance) {
    return `${min}${abbrevUnits} - ${max}${abbrevUnits}`;
  } else if (min > 0 && max === maxDistance) {
    return `${min}${abbrevUnits} & greater`;
  } else if (min === 0 && max < maxDistance) {
    return `${max}${abbrevUnits} & less`;
  }
};

const Badges: React.FC<BadgesProps> = ({
  filters,
  removeFilter,
  length,
  units,
  maxDistance,
}) => {
  const renderBadges = (filters: Filters, maxDistance: number) => {
    return Object.keys(filters).map((filter) => {
      if (filter === 'keyword' && filters.keyword) {
        return (
          <Badge key={filter} onClick={() => removeFilter(filter)}>
            Keyword: {filters.keyword} X
          </Badge>
        );
      } else if (filter === 'range') {
        const range = filters.range;
        const min = Math.min(range[0], range[1]);
        const max = Math.max(range[0], range[1]);

        if (min > 0 || max < maxDistance) {
          return (
            <Badge key={filter} onClick={() => removeFilter(filter)}>
              Distance: {renderDistance(min, max, maxDistance, units)} X
            </Badge>
          );
        }
      } else if (
        (filter === 'sports' && filters.sports.length > 0) ||
        (filter === 'surfaces' && filters.surfaces.length > 0)
      ) {
        const title = filter === 'sports' ? 'Sports' : 'Surfaces';

        return (
          <Badge key={filter} onClick={() => removeFilter(filter)}>
            {title}: {filters[filter].map((item) => `${item} `)} X
          </Badge>
        );
      }
    });
  };

  return (
    <BadgeList>
      <p>{length} routes</p>
      {renderBadges(filters, maxDistance)}
    </BadgeList>
  );
};

export default Badges;

const Badge = styled.div`
  padding: 6px 8px;
  font-size: 1.2rem;
  border-radius: 2px;
  color: ${(props) => props.theme.colors.teal[800]};
  background-color: ${(props) => props.theme.colors.teal[100]};
  white-space: nowrap;

  @media screen and (max-width: ${(props) => props.theme.screens.sm}) {
    font-size: 1rem;
  }

  &:hover {
    cursor: pointer;
  }
`;

const BadgeList = styled.div`
  display: flex;
  flex: 1;
  overflow: scroll;
  height: min-content;
  align-items: center;

  @media screen and (max-width: ${(props) => props.theme.screens.md}) {
    display: none;
  }

  & > p {
    margin-right: 1rem;
    font-size: 1.4rem;
    font-style: italic;
    white-space: nowrap;
  }

  & > div:not(:last-child) {
    margin-right: 6px;
  }
`;
