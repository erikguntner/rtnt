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

import { withAuthSync } from '../../utils/auth';

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

const Profile: NextPage<{}> = () => {
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

  return (
    <MapContainer>
      {data && (
        <ElevationProfile
          {...{
            units,
            setDistanceAlongPath,
          }}
          elevationData={data.route.elevation_data}
          lines={data.route.lines}
        />
      )}
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
      {!data && <LoadingIndicator />}
      {data && (
        <DistanceIndicator
          {...{ units, authenticated }}
          elevationData={data.route.elevation_data}
        />
      )}
    </MapContainer>
  );
};

const MapContainer = styled.div`
  height: calc(100vh - ${(props) => props.theme.navHeight});
  width: 100vw;
  display: grid;
  grid-template-rows: 70% 30%;
  flex-direction: column;
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

export default withAuthSync(Profile);
