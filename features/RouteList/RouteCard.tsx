import React from 'react';
import styled from 'styled-components';

interface Props {
  id: number;
  name: string;
  image: string;
  totalDistance: number[];
}

const RouteCard: React.FC<Props> = ({ id, name, image, totalDistance }) => {
  return (
    <article>
      <ImageFigure>
        <img src={image} alt="map" />
      </ImageFigure>
      <div>
        <h3>{name}</h3>
        <p>{totalDistance[totalDistance.length - 1].toFixed(2)}</p>
      </div>
    </article>
  );
};

const ImageFigure = styled.figure`
  height: 15rem;

  & > img {
    height: 100%;
    width: 100%;
  }
`;

export default RouteCard;
