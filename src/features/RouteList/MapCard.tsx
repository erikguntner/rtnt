import React from 'react';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import {
  calculateDistance,
  abbreviatedDistance,
} from '../../utils/calculateDistance';
import styled from 'styled-components';
import * as turf from '@turf/helpers';
import center from '@turf/center';
import bbox from '@turf/bbox';

import { Route } from './RouteList';
import { LatLngExpression } from 'leaflet';

interface MapCardProps {
  route: Route;
}

const MapCard = ({
  route: { name, lines, city, state, distance },
}: MapCardProps) => {
  const multiLine = React.useMemo(() => turf.multiLineString(lines), [lines]);
  const bounds = bbox(multiLine);
  const latLngLine = React.useMemo(
    () =>
      lines.map((line) => line.map((point) => [point[1], point[0], point[2]])),
    [lines]
  );
  const {
    geometry: { coordinates: points },
  } = center(multiLine);

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
          paddingBottomRight: [16, 16],
        }}
        scrollWheelZoom={false}
        dragging={false}
        zoomControl={false}
        doubleClickZoom={false}
      >
        <TileLayer
          url={`https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.MAPBOX_TOKEN}`}
        />
        <Marker position={[51.505, -0.09]}></Marker>
        <Polyline
          pathOptions={{ color: '#0070f3' }}
          positions={latLngLine as LatLngExpression[] | LatLngExpression[][]}
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
          <svg
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
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24"
            width="24"
            viewBox="0 0 24 24"
            stroke="#fff"
            fill="#fff"
          >
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </div>
      </Overlay>
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  height: 240px;
  width: 100%;
  z-index: 1;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.02);
    box-shadow: ${({ theme }) => theme.boxShadow.xl};
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
  background: linear-gradient(
    172deg,
    hsla(0, 0%, 0%, 0.95) 0%,
    hsla(0, 0%, 11.29%, 0.938) 8.1%,
    hsla(0, 0%, 22.04%, 0.905) 15.5%,
    hsla(0, 0%, 32.25%, 0.853) 22.5%,
    hsla(0, 0%, 41.88%, 0.787) 29%,
    hsla(0, 0%, 50.92%, 0.709) 35.3%,
    hsla(0, 0%, 59.33%, 0.623) 41.2%,
    hsla(0, 0%, 67.09%, 0.531) 47.1%,
    hsla(0, 0%, 74.16%, 0.439) 52.9%,
    hsla(0, 0%, 80.5%, 0.347) 58.8%,
    hsla(0, 0%, 86.07%, 0.261) 64.7%,
    hsla(0, 0%, 90.81%, 0.183) 71%,
    hsla(0, 0%, 94.66%, 0.117) 77.5%,
    hsla(0, 0%, 97.54%, 0.065) 84.5%,
    hsla(0, 0%, 99.36%, 0.032) 91.9%,
    hsla(0, 0%, 100%, 0.02) 100%
  );

  h2 {
    line-height: 1;
    font-size: 2.4rem;
    font-weight: 500;
    letter-spacing: 0.8px;
    color: #fff;
  }

  p {
    font-size: 1.4rem;
    color: rgba(255, 255, 255, 0.9);
  }

  div:nth-of-type(2) {
    width: fit-content;
    display: flex;
    justify-content: center;
  }
`;

export default MapCard;
