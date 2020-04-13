import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';

import {
  calculateDistance,
  abbreviatedDistance,
} from '../../utils/calculateDistance';

interface ElevationData {
  distance: number;
  segDistance: number;
  elevation: number;
}

interface Props {
  id: number;
  name: string;
  image: string;
  elevationData: ElevationData[][];
  units: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const RouteCard: React.FC<Props> = ({
  id,
  name,
  image,
  elevationData,
  units,
}) => {
  return (
    <Card>
      <ImageFigure>
        <img src={image} alt="map" />
      </ImageFigure>
      <Content>
        <h3>{name}</h3>
        <Row>
          <Distance>
            <span>{calculateDistance(elevationData, units)}</span>
            <span>{abbreviatedDistance(units)}</span>
          </Distance>
          <Link href="/route/[id]" as={`/route/${id}`}>
            <ViewLink>View</ViewLink>
          </Link>
        </Row>
      </Content>
    </Card>
  );
};

const Card = styled.article`
  max-width: 300px;
  box-shadow: ${(props) => props.theme.boxShadow.sm};
`;

const ImageFigure = styled.figure`
  height: 18rem;
  border-radius: 2px 2px 0 0;

  & > img {
    height: 100%;
    width: 100%;
    border-radius: 2px 2px 0 0;
  }
`;

const Content = styled.div`
  margin: 0 auto;
  padding: 1.8rem;
  background-color: #fff;
  border-radius: 0 0 2px 2px;

  & > h3 {
    margin-bottom: 8px;
    line-height: 1;
    font-size: 2.4rem;
    color: ${(props) => props.theme.colors.gray[900]};
  }
`;

const ViewLink = styled.a`
  padding: 6px 1.2rem;
  font-size: 1.2rem;
  color: ${(props) => props.theme.colors.primary};
  text-decoration: none;
  text-transform: uppercase;
  transition: all 0.2s ease;
  border-radius: 2px;

  &:hover {
    background-color: ${(props) => props.theme.colors.newBlues[100]};
    cursor: pointer;
  }
`;

const Distance = styled.p`
  & > span {
    margin-right: 4px;
    font-size: 1.4rem;
  }
`;

const Row = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
`;

export default RouteCard;
