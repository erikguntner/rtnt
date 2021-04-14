import React from 'react';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import { divIcon, LatLngExpression } from 'leaflet';
import { renderToStaticMarkup } from 'react-dom/server';
import styled from 'styled-components';
import * as turf from '@turf/helpers';
import bbox from '@turf/bbox';

import {
  calculateDistance,
  abbreviatedDistance,
} from '../../utils/calculateDistance';
import { Route } from './RouteList';
import RouteOptionsMenu from './RouteOptionsMenu';

interface MapCardProps {
  route: Route;
}

const stopPropagation = (event: React.MouseEvent<HTMLButtonElement>) => {
  event.preventDefault();
  event.stopPropagation();
  event.nativeEvent.stopImmediatePropagation();
};

interface CustomMarkerProps {
  position: number[];
  color: string;
}

const CustomMarker = ({ position, color }: CustomMarkerProps) => {
  const iconMarkup = renderToStaticMarkup(<Circle color={color} />);
  const customMarkerIcon = divIcon({
    html: iconMarkup,
  });

  return (
    <Marker icon={customMarkerIcon} position={position as LatLngExpression} />
  );
};

const MapCard = ({ route }: MapCardProps) => {
  const { name, lines, city, state, start_point, end_point } = route;

  const multiLine = React.useMemo(() => turf.multiLineString(lines), [lines]);
  const bounds = bbox(multiLine);
  const latLngLine = React.useMemo(
    () =>
      lines.map((line) => line.map((point) => [point[1], point[0], point[2]])),
    [lines]
  );

  const toggleFavorite = (e: React.MouseEvent<HTMLButtonElement>) => {
    stopPropagation(e);
    console.log('favorited');
  };

  return (
    <Container>
      <MapContainer
        style={{ height: '100%', width: '100%', zIndex: 5 }}
        bounds={[
          [bounds[1], bounds[0]],
          [bounds[3], bounds[2]],
        ]}
        boundsOptions={{
          paddingTopLeft: [100, 100],
          paddingBottomRight: [20, 20],
        }}
        scrollWheelZoom={false}
        dragging={false}
        zoomControl={false}
        doubleClickZoom={false}
      >
        <TileLayer
          url={`https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.MAPBOX_TOKEN}`}
        />
        <Polyline
          pathOptions={{ color: '#0070f3' }}
          positions={latLngLine as LatLngExpression[] | LatLngExpression[][]}
        />
        <CustomMarker
          color={'#68d391'}
          position={[start_point[1], start_point[0]]}
        />
        <CustomMarker
          color={'#e53e3e'}
          position={[end_point[1], end_point[0]]}
        />
      </MapContainer>
      <Overlay>
        <div>
          <h2>{name}</h2>
          <p>
            {city}, {state}
          </p>
          <p>
            {calculateDistance(lines, 'miles')} {abbreviatedDistance('miles')}
          </p>
        </div>
        <div>
          <StarButton onClick={toggleFavorite}>
            <Star
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              height="24"
              width="24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                stroke="#ffc107"
                strokeWidth={2}
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
              />
            </Star>
          </StarButton>
          <RouteOptionsMenu route={route} />
        </div>
      </Overlay>
    </Container>
  );
};

const Circle = styled.div<{ color: string }>`
  height: 1.2rem;
  width: 1.2rem;
  background-color: ${(props) => props.color};
  border: 2px solid #fff;
  border-radius: 50%;
`;

const Container = styled.div`
  position: relative;
  height: 240px;
  width: 100%;
  z-index: 1;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.2s ease;
  box-shadow: ${({ theme }) => theme.boxShadow.default};

  /* remove default styling for leaflet divIcon so no background or border show around markers */
  .leaflet-div-icon {
    background: transparent;
    border: none;
  }

  &:hover {
    transform: scale(1.01);
    box-shadow: ${({ theme }) => theme.boxShadow.lg};
  }
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 1.6rem;
  display: flex;
  justify-content: space-between;
  z-index: 10;
  color: black;
  background: linear-gradient(
    166deg,
    hsla(0, 0%, 100%, 0.98) 0%,
    hsla(0, 0%, 100%, 0.915) 11.8%,
    hsla(0, 0%, 100%, 0.843) 20.9%,
    hsla(0, 0%, 100%, 0.765) 27.6%,
    hsla(0, 0%, 100%, 0.684) 32.4%,
    hsla(0, 0%, 100%, 0.6) 35.9%,
    hsla(0, 0%, 100%, 0.515) 38.5%,
    hsla(0, 0%, 100%, 0.432) 40.7%,
    hsla(0, 0%, 100%, 0.351) 42.9%,
    hsla(0, 0%, 100%, 0.274) 45.6%,
    hsla(0, 0%, 100%, 0.204) 49.4%,
    hsla(0, 0%, 100%, 0.141) 54.7%,
    hsla(0, 0%, 100%, 0.088) 61.9%,
    hsla(0, 0%, 100%, 0.045) 71.5%,
    hsla(0, 0%, 100%, 0.016) 84.1%,
    hsla(0, 0%, 100%, 0) 100%
  );

  h2 {
    line-height: 1;
    font-size: 2.4rem;
    font-weight: 500;
    letter-spacing: 0.8px;
  }

  p {
    font-size: 1.6rem;
    color: rgba(0, 0, 0, 0.75);
  }

  div:nth-of-type(2) {
    width: fit-content;
    display: flex;
    align-items: center;
    height: fit-content;
  }
`;

const StarButton = styled.button`
  line-height: 1;
  margin-right: 8px;
  background: transparent;
  border: none;

  &:hover {
    cursor: pointer;
  }
`;

const Star = styled.svg``;

export default MapCard;
