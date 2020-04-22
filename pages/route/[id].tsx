import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { NextPage, GetServerSideProps } from 'next';
import nextCookie from 'next-cookies';
import Router from 'next/router';
import ReactMapGL, { Marker } from 'react-map-gl';
import * as turf from '@turf/turf';
import * as turfHelpers from '@turf/helpers';
import WebMercatorViewport from 'viewport-mercator-project';

import bbox from '@turf/bbox';
import styled from 'styled-components';
import fetch from 'isomorphic-unfetch';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisH } from '@fortawesome/free-solid-svg-icons';

import ElevationProfile from '../../features/Map/ElevationProfile';
import DistanceMarkers from '../../features/Map/DistanceMarkers';
import { RootState } from '../../app/rootReducer';
import SvgPath from '../../features/Map/SvgPath';
import Pin from '../../features/Map/Pin';
import {
  calculateDistance,
  abbreviatedDistance,
} from '../../utils/calculateDistance';
import PopOut from '../../features/Utilities/PopOut';
import API_URL from '../../utils/url';
import { ParsedUrlQuery } from 'querystring';

interface Viewport {
  latitude: number;
  longitude: number;
  zoom: number;
  bearing: number;
  pitch: number;
}

interface RouteI {
  id: number;
  user_id: string;
  created_at: string;
  name: string;
  image: string;
  start_point: number[];
  end_point: number[];
  points: number[][];
  lines: number[][][];
  distance: number[];
  sports: string[];
  surface: string[];
}

const deleteRoute = async (id) => {
  try {
    const response = await fetch(`/api/route/${id}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    });

    if (response.ok) {
      const data = response.json();
      Router.push('/myroutes');
    } else {
      const error = new Error(response.statusText);
      console.log(error);
    }
  } catch (err) {
    // console.log(err);
    console.log('send notification of error', err);
  }
};

const RoutePage: NextPage<{ data: RouteI }> = ({ data }) => {
  const [viewport, setViewport] = useState<Viewport>({
    latitude: 34.105999576,
    longitude: -117.718497126,
    zoom: 12,
    bearing: 0,
    pitch: 0,
  });
  const [distanceAlongPath, setDistanceAlongPath] = useState<number>(0);
  const [pointAlongPath, setPointAlongPath] = useState<number[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const options = useRef<HTMLDivElement>(null);
  const mapRef = useRef(null);

  const {
    user: { units },
  } = useSelector((state: RootState) => ({
    user: state.auth.user,
  }));

  useEffect(() => {
    if (distanceAlongPath !== 0 && data) {
      const line = turf.lineString(data.lines.flat());

      const segment = turf.along(line, distanceAlongPath, { units });

      setPointAlongPath(segment.geometry.coordinates);
    } else {
      setPointAlongPath([]);
    }
  }, [distanceAlongPath]);

  useEffect(() => {
    const { transform } = mapRef.current;
    const line = turfHelpers.multiLineString(data.lines);
    const bBox = bbox(line);
    const newViewport = new WebMercatorViewport({
      width: transform.width,
      height: transform.height,
    }).fitBounds(
      [
        [bBox[0], bBox[1]],
        [bBox[2], bBox[3]],
      ],
      {
        padding: 30,
      }
    );
    setViewport({
      ...newViewport,
    });
  }, []);

  const startAndEndCoords = [
    data.points[0],
    data.points[data.points.length - 1],
  ];

  return (
    <Wrapper>
      <Header>
        <h1>{data.name}</h1>
        <HeaderRight>
          <Distance>
            <span>{calculateDistance(data.lines, units)}</span>
            <span>{abbreviatedDistance(units)}</span>
          </Distance>
          <Options ref={options}>
            <OptionsButton onClick={() => setOpen(!open)}>
              <FontAwesomeIcon icon={faEllipsisH} />
            </OptionsButton>
            <PopOut
              motionKey="optionsPopOut"
              parentRef={options}
              {...{ open, setOpen }}
            >
              <button
                onClick={() => {
                  setOpen(false);
                  deleteRoute(data.id);
                }}
              >
                Delete Route
              </button>
            </PopOut>
          </Options>
        </HeaderRight>
      </Header>
      <MapContainer>
        <ReactMapGL
          {...viewport}
          ref={(ref) => (mapRef.current = ref && ref.getMap())}
          mapboxApiAccessToken={process.env.MAPBOX_TOKEN}
          reuseMap={true}
          width={'100%'}
          height={'100%'}
          style={{ display: 'flex', flex: '1' }}
          onViewportChange={(viewport) => setViewport(viewport)}
          mapStyle="mapbox://styles/mapbox/outdoors-v10"
        >
          {data && (
            <>
              <SvgPath points={data.lines} />
              {/* <DistanceMarkers {...{ units }} lines={data.route.lines} /> */}
              {pointAlongPath.length ? (
                <Marker
                  longitude={pointAlongPath[0]}
                  latitude={pointAlongPath[1]}
                >
                  <Label>{distanceAlongPath.toFixed(2)}</Label>
                  <DistanceMarker />
                </Marker>
              ) : null}
              {startAndEndCoords.map((point, i) => (
                <Marker key={i} longitude={point[0]} latitude={point[1]}>
                  <Pin index={i} points={startAndEndCoords} />
                </Marker>
              ))}
            </>
          )}
        </ReactMapGL>
          <ElevationWrapper>
            <ElevationProfile
              {...{
                units,
                setDistanceAlongPath,
              }}
              lines={data.lines}
            />
          </ElevationWrapper>
      </MapContainer>
      <Block />
    </Wrapper>
  );
};

export const getServerSideProps: GetServerSideProps<
  {
    [key: string]: any;
  },
  ParsedUrlQuery
> = async (context) => {
  const { token } = nextCookie(context);
  const { id } = context.query;

  const response = await fetch(`${API_URL}/api/route/${id}`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
      authorization: JSON.stringify(token),
    },
  });

  const data = await response.json();

  return { props: { data: data.route } };
};

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  height: calc(100vh - ${(props) => props.theme.navHeight});
  width: 100vw;
`;

const Header = styled.div`
  display: flex;
  width: 75vw;
  padding: 1.6rem 0;
  z-index: 200;
  justify-content: space-between;
  align-items: center;

  @media screen and (max-width: ${(props) => props.theme.screens.sm}) {
    width: 95vw;
  }

  & h1 {
    letter-spacing: 2px;
    font-size: 3.6rem;
    color: #fff;

    @media screen and (max-width: ${(props) => props.theme.screens.sm}) {
      font-size: 2.4rem;
    }
  }

  & p {
    margin-right: 1.6rem;

    span {
      color: #fff;
      font-size: 2.4rem;

      @media screen and (max-width: ${(props) => props.theme.screens.sm}) {
        font-size: 1.8rem;
      }
    }
  }
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
`;

const Options = styled.div`
  position: relative;
`;

const OptionsButton = styled.button`
  padding: 0 1.2rem;
  font-size: 1.8rem;
  background-color: #fff;
  border: none;
  border-radius: 2px;

  @media screen and (max-width: ${(props) => props.theme.screens.sm}) {
    font-size: 1.4rem;
  }

  &:hover {
    cursor: pointer;
  }

  &:focus {
    outline: none;
    box-shadow: ${(props) => props.theme.boxShadow.outline};
  }
`;

const Distance = styled.p`
  & > span {
    margin-right: 4px;
    font-size: 1.4rem;
  }
`;

const Block = styled.div`
  height: 200px;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background-color: ${(props) => props.theme.colors.gray[800]};

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: calc(100% - 32px);
    margin: 0 1.6rem;
    height: 1px;
    background-color: ${(props) => props.theme.colors.gray[700]};
  }
`;

const MapContainer = styled.div`
  height: 75%;
  width: 75vw;
  display: grid;
  grid-template-rows: 70% 30%;
  z-index: 100;
  box-shadow: ${(props) => props.theme.boxShadow.sm};

  @media screen and (max-width: ${(props) => props.theme.screens.sm}) {
    width: 95vw;
    height: 85%;
  }
`;

const ElevationWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;

  & > div {
    height: 100%;
  }
`;

const Label = styled.div`
  position: absolute;
  background-color: #333;
  opacity: 0.9;
  padding: 2px 6px;
  color: #fff;
  font-size: 1rem;
  border-radius: 5px;
  transform: translate3d(-50%, -150%, 0);
`;

const DistanceMarker = styled.div`
  font-size: 1rem;
  line-height: 1;
  background-color: #fff;
  height: 1.2rem;
  width: 1.2rem;
  border-radius: 10px;
  border: 2px solid ${(props) => props.theme.colors.indigo[500]};
  transform: translate3d(-50%, -50%, 0);
`;

export default RoutePage;
