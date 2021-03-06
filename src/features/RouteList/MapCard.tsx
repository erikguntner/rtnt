import React, { useState } from 'react';
import Router from 'next/router';
import { useDispatch } from 'react-redux';
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
import { deleteRoute } from './routeListSlice';
import { Route } from './RouteList';
import Modal from '../Utilities/Modal';
import RouteOptionsMenu from './RouteOptionsMenu';

const deleteRouteClient = async (id: number, image: string): Promise<any> => {
  const imageId: string = image.split('/')[4];

  try {
    const response = await fetch(`/api/route/${id}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ imageId }),
    });

    const data = await response.json();

    if (response.ok) {
      return data;
    }

    throw new Error(data.message);
  } catch (err) {
    return Promise.reject(
      err.message ? err.message : 'there was an error deleting'
    );
  }
};

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
  const [open, setOpen] = useState<boolean>(false);
  const dispatch = useDispatch();
  const { name, lines, city, state, start_point, end_point, id, image } = route;

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

  const handleDeleteRoute = async () => {
    try {
      await deleteRouteClient(id, image);
      dispatch(deleteRoute(id));
      setOpen(false);
    } catch (err) {
      // TODO: display toast
      setOpen(false);
    }
  };

  return (
    <>
      <a
        key={id}
        href={`/route/${id}`}
        onClick={(e) => {
          e.preventDefault();
          Router.push(`/route/${id}`);
        }}
      >
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
              positions={
                latLngLine as LatLngExpression[] | LatLngExpression[][]
              }
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
                {calculateDistance(lines, 'miles')}{' '}
                {abbreviatedDistance('miles')}
              </p>
            </div>
            <div>
              {/* <StarButton onClick={toggleFavorite}>
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
              </StarButton> */}
              <RouteOptionsMenu setDeleteModal={setOpen} route={route} />
            </div>
          </Overlay>
        </Container>
      </a>
      <Modal open={open} toggle={() => setOpen(!open)}>
        <Alert>
          <Icon>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </Icon>
          <h3>Are you sure you want to delete this route?</h3>
          <ButtonRow>
            <button onClick={() => setOpen(!open)}>Cancel</button>
            <button onClick={handleDeleteRoute}>Delete</button>
          </ButtonRow>
        </Alert>
      </Modal>
    </>
  );
};

const Alert = styled.div`
  padding: 2.4rem;
  max-width: 40rem;

  & > h3 {
    font-size: 1.8rem;
    font-weight: 500;
    margin-bottom: 8px;
    text-align: center;
  }
`;

const Icon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 4rem;
  width: 4rem;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 8px;
  border-radius: 50%;
  background-color: ${(props) => props.theme.colors.red[200]};
  color: ${(props) => props.theme.colors.red[600]};

  & svg {
    height: 2.4rem;
  }
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: center;

  @media screen and (max-width: ${(props) => props.theme.screens.sm}) {
    flex-direction: column;
  }

  & button {
    padding: 1.2rem 2.4rem;
    font-size: 1.4rem;
    line-height: 1;
    border-radius: 8px;
    border: none;
    transition: all 0.2s ease;

    @media screen and (max-width: ${(props) => props.theme.screens.sm}) {
      width: 100%;
    }

    &:hover {
      cursor: pointer;
    }

    &:first-of-type {
      margin-right: 1.6rem;
      background-color: #fff;
      border: 1px solid ${(props) => props.theme.colors.gray[400]};

      @media screen and (max-width: ${(props) => props.theme.screens.sm}) {
        margin-right: 0px;
        margin-bottom: 8px;
      }

      &:hover {
        background-color: ${(props) => props.theme.colors.gray[100]};
      }
    }

    &:last-of-type {
      background-color: ${(props) => props.theme.colors.red[600]};
      color: #fff;

      &:hover {
        background-color: ${(props) => props.theme.colors.red[700]};
      }
    }
  }
`;

const Circle = styled.div<{ color: string }>`
  height: 1.2rem;
  width: 1.2rem;
  background-color: ${(props) => props.color};
  border: 2px solid #fff;
  border-radius: 50%;
`;

const Container = styled.div`
  position: relative;
  height: 100%;
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
