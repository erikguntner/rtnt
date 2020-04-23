import React from 'react';
import styled from 'styled-components';

import {
  calculateDistance,
  abbreviatedDistance,
} from '../../utils/calculateDistance';

interface HorizontalRouteCardProps {
  name: string;
  image: string;
  units: 'kilometers' | 'miles';
  lines: number[][][];
  city: string;
  state: string;
}

const HorizontalRouteCard: React.FC<HorizontalRouteCardProps> = ({
  name,
  image,
  units,
  lines,
  city,
  state,
}) => {
  return (
    <RouteCard>
      <Content>
        <p>{name}</p>
        <p>
          <span>{calculateDistance(lines, units)}</span>
          <span>{abbreviatedDistance(units)}</span>
        </p>
        <p>
          <span>{city}</span>
          <span>{state}</span>
        </p>
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
  margin-right: 2rem;
`;

const ImageFigure = styled.figure`
  width: 14rem;
  height: 8rem;
  border-radius: 2px 2px 0 0;
  overflow: hidden;

  & > img {
    object-fit: cover;
    width: 100%;
    border-radius: 2px 2px 0 0;
  }
`;

export default HorizontalRouteCard;
