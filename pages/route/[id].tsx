import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import ReactMapGL, { Marker } from 'react-map-gl';
import * as turf from '@turf/turf';
import styled from 'styled-components';
import fetch from 'isomorphic-unfetch';

import ElevationProfile from '../../features/Map/ElevationProfile';
import DistanceMarkers from '../../features/Map/DistanceMarkers';
import DistanceIndicator from '../../features/Map/DistanceIndicator';
import LoadingIndicator from '../../features/Map/LoadingIndicator';
import { RootState } from '../../app/rootReducer';
import SvgPath from '../../features/Map/SvgPath';

interface Viewport {
  latitude: number;
  longitude: number;
  zoom: number;
  bearing: number;
  pitch: number;
}

interface ElevationData {
  distance: number;
  segDistance: number;
  elevation: number;
}

interface RouteI {
  id: number;
  name: string;
  image: string;
  points: number[][];
  lines: number[][][];
  total_distance: number[];
  elevation_data: ElevationData[][];
  created_on: string;
}

const fetcher = async (url, authenticated) => {
  const response = await fetch(url, {
    method: 'GET',
    credentials: 'include',
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
      Authorization: JSON.stringify(authenticated),
    },
  });

  if (response.ok) {
    const data = response.json();
    return data;
  } else {
    return { message: 'there was an error' };
  }
};

const RoutePage: NextPage<{}> = () => {
  const [viewport, setViewport] = useState<Viewport>({
    latitude: 34.105999576,
    longitude: -117.718497126,
    zoom: 14,
    bearing: 0,
    pitch: 0,
  });
  const [distanceAlongPath, setDistanceAlongPath] = useState<number>(0);
  const [pointAlongPath, setPointAlongPath] = useState<number[]>([]);
  const {
    authenticated,
    user: { units },
  } = useSelector((state: RootState) => ({
    authenticated: state.auth.authenticated,
    user: state.auth.user,
  }));

  const router = useRouter();
  const { id } = router.query;

  const { data, error } = useSWR(
    [`/api/getRoute/${id}`, authenticated],
    fetcher
  );

  if (error) {
    console.log(error);
  }

  useEffect(() => {
    if (distanceAlongPath !== 0 && data) {
      const line = turf.lineString(data.route.lines.flat());

      const segment = turf.along(line, distanceAlongPath, { units });

      setPointAlongPath(segment.geometry.coordinates);
    } else {
      setPointAlongPath([]);
    }
  }, [distanceAlongPath]);

  console.log(data);

  return (
    <Wrapper>
      <MapContainer>
        <Title>{data ? data.route.name : ''}</Title>
        <ReactMapGL
          {...viewport}
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
              <SvgPath points={data.route.lines} />
              <DistanceMarkers {...{ units }} lines={data.route.lines} />
              {pointAlongPath.length ? (
                <Marker
                  longitude={pointAlongPath[0]}
                  latitude={pointAlongPath[1]}
                >
                  <Label>{distanceAlongPath.toFixed(2)}</Label>
                  <DistanceMarker />
                </Marker>
              ) : null}
            </>
          )}
        </ReactMapGL>
        {data && (
          <ElevationWrapper>
            <ElevationProfile
              {...{
                units,
                setDistanceAlongPath,
              }}
              elevationData={data.route.elevation_data}
              lines={data.route.lines}
            />
          </ElevationWrapper>
        )}
        {!data && <LoadingIndicator />}
        {data && (
          <DistanceIndicator
            {...{ units, authenticated }}
            elevationData={data.route.elevation_data}
          />
        )}
      </MapContainer>
      <Block />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  height: calc(100vh - ${(props) => props.theme.navHeight});
  width: 100vw;
`;

const Title = styled.h1`
  letter-spacing: 2px;
  padding: 1.6rem 0;
  font-size: 3.6rem;
  color: #fff;
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
    width: 100%;
    margin: 0 1.6rem;
    height: 1px;
    background-color: ${(props) => props.theme.colors.gray[700]};
  }
`;

const MapContainer = styled.div`
  height: 75%;
  width: 75vw;
  display: grid;
  grid-template-rows: min-content 70% 30%;
  z-index: 100;
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
