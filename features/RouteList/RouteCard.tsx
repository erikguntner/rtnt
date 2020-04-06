import React from 'react';
import styled from 'styled-components';

interface Props {
  id: number;
  name: string;
  image: string;
  totalDistance: number[];
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const RouteCard: React.FC<Props> = ({ id, name, image, totalDistance }) => {
  return (
    <Card>
      <ImageFigure>
        <img src={image} alt="map" />
      </ImageFigure>
      <Content>
        <h3>{name}</h3>
        <p>{totalDistance[totalDistance.length - 1].toFixed(2)}</p>
      </Content>
    </Card>
  );
};

const Card = styled.article`
  max-width: 300px;
`;

const ImageFigure = styled.figure`
  height: 18rem;
  border-radius: 2px;

  & > img {
    height: 100%;
    width: 100%;
    border-radius: 2px;
  }
`;

const Content = styled.div`
  width: 90%;
  margin: 0 auto;
  padding: 1.8rem;
  transform: translateY(-25%);
  background-color: #fff;
  border-radius: 2px;
  box-shadow: ${(props) => props.theme.boxShadow.md};

  & > h3 {
    line-height: 1;
    font-size: 2.4rem;
    color: ${(props) => props.theme.colors.gray[900]};
  }
`;

export default RouteCard;
