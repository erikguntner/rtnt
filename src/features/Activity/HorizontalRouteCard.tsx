import React from 'react';
import styled from 'styled-components';

import {
  calculateDistance,
  abbreviatedDistance,
} from '../../utils/calculateDistance';
import getStateAbbreviation from '../../utils/getStateAbbreviation';

interface HorizontalRouteCardProps {
  name: string;
  image: string;
  units: 'kilometers' | 'miles';
  lines: number[][][];
  city: string;
  state: string;
  handleClick?: (any) => void;
}

const HorizontalRouteCard: React.FC<HorizontalRouteCardProps> = ({
  name,
  image,
  units,
  lines,
  city,
  state,
  handleClick
}) => {
  return (
    <RouteCard onClick={handleClick}>
      <Content>
        <Name>{name}</Name>
        <Distance>
          {calculateDistance(lines, units)} {abbreviatedDistance(units)}
        </Distance>
        <Location>
          {city}, {getStateAbbreviation(state)}
        </Location>
      </Content>
      <div>
        <ImageFigure>
          <img src={image} alt="map" />
        </ImageFigure>
      </div>
    </RouteCard>
  );
};

const RouteCard = styled.article`
  display: flex;
  padding: 1.6rem;
  font-size: 1.6rem;
  justify-content: space-between;
  align-items: center;
  border: 1px solid ${(props) => props.theme.colors.gray[400]};
  transition: 0.2s all ease;

  &:hover {
    border: 1px solid ${(props) => props.theme.colors.gray[600]};
    box-shadow: ${(props) => props.theme.boxShadow.sm};
    cursor: pointer;
  }

  &:not(:last-of-type) {
    margin-bottom: 1.2rem;
  }
`;

const Content = styled.div`
  width: 20rem;
`;

const Name = styled.p`
  font-size: 2rem;
`;

const Distance = styled.p`
  color: ${(props) => props.theme.colors.gray[700]};
`;

const Location = styled.p`
  color: ${(props) => props.theme.colors.gray[700]};
  white-space: nowrap;
`;

const ImageFigure = styled.figure`
  width: 16rem;
  height: 9rem;
  border-radius: 2px 2px 0 0;
  overflow: hidden;

  & > img {
    object-fit: cover;
    width: 100%;
    border-radius: 2px 2px 0 0;
  }
`;

export default HorizontalRouteCard;
