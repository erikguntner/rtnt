import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';

import {
  calculateDistance,
  abbreviatedDistance,
} from '../../utils/calculateDistance';
import { icons } from '../Utilities/Tag';

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
  sports: string[];
  surfaces: string[];
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const RouteCard: React.FC<Props> = ({
  id,
  name,
  image,
  elevationData,
  units,
  sports,
  surfaces,
}) => {
  return (
    <Card>
      <ImageFigure>
        <img src={image} alt="map" />
      </ImageFigure>
      <Content>
        <Row>
          <Name>{name}</Name>
          <Distance>
            <span>{calculateDistance(elevationData, units)}</span>
            <span>{abbreviatedDistance(units)}</span>
          </Distance>
        </Row>
        <Row>
          <Icons>
            <>{sports.map((sport) => icons[sport])}</>
            <>{surfaces.map((surface) => icons[surface])}</>
          </Icons>
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
`;

const Name = styled.h3`
  line-height: 1;
  font-size: 2.4rem;
  color: ${(props) => props.theme.colors.gray[900]};
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
  & span {
    margin-right: 4px;
    font-size: 1.4rem;

    &:first-of-type {
      font-size: 2.4rem;
    }
  }
`;

const Icons = styled.div`
  display: flex;
  font-size: 1.4rem;

  & > svg {
    &:not(:last-of-type) {
      margin-right: 1rem;
    }
  }
`;

const Row = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
`;

export default RouteCard;
