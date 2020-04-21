import React, { useState, useEffect, useRef } from 'react';
import { connect, useSelector, useDispatch } from 'react-redux';
import * as turf from '@turf/turf';
import ReactMapGL, {
  Marker,
  NavigationControl,
  PointerEvent,
} from 'react-map-gl';
import styled from 'styled-components';

import store from '../../app/store';
import { RootState } from '../../app/rootReducer';
import { AppDispatch } from '../../app/store';
import { addRoute, updateRouteAfterDrag, fetchSinglePoint } from './routeSlice';
import useWindowSize from '../../utils/useWindowSize';

import SvgPath from './SvgPath';
import GeoJsonPath from './GeoJsonPath';
import ConnectingLines from './ConnectingLines';
import ElevationProfile from './ElevationProfile';
import Controls from './Controls';
import Pin from './Pin';
import DistanceMarkers from './DistanceMarkers';
import DistanceIndicator from './DistanceIndicator';
import LoadingIndicator from './LoadingIndicator';

interface Viewport {
  latitude: number;
  longitude: number;
  zoom: number;
  bearing: number;
  pitch: number;
}
const Map = () => {
  const [width, height] = useWindowSize();
  const [clipPath, setClipPath] = useState<boolean>(false);
  const [position, setPosition] = useState<number[]>([]);
  const [showElevation, setShowElevation] = useState<boolean>(false);
  const [viewport, setViewport] = useState<Viewport>({
    latitude: 42.5,
    longitude: 12.5,
    zoom: 5,
    bearing: 0,
    pitch: 0,
  });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [point, setPoint] = useState<number[]>([]);
  const [index, setIndex] = useState<number>(0);
  const [touchPoint, setTouchPoint] = useState<number[]>([]);
  // state for syncing mouseevents for chart and map
  const [distanceAlongPath, setDistanceAlongPath] = useState<number>(0);
  const [pointAlongPath, setPointAlongPath] = useState<number[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const [hoveredPoint, setHoveredPoint] = useState<number[]>();

  const dispatch: AppDispatch = useDispatch();
  const {
    isLoading,
    points,
    totalDistance,
    lines,
    authenticated,
    user: { units },
  } = useSelector((state: RootState) => ({
    isLoading: state.loading.isLoading,
    points: state.route.present.points,
    totalDistance: state.route.present.totalDistance,
    lines: state.route.present.lines,
    authenticated: state.auth.authenticated,
    user: state.auth.user,
  }));

  const handleClick = (event) => {
    const [newLong, newLat] = event.lngLat;
    // store.dispatch({ type: 'ADD_POINT' });

    if (points.length) {
      const newPoint = [newLong, newLat];
      const [startLong, startLat] = points.length
        ? points[points.length - 1]
        : [null, null];

      dispatch(
        addRoute({
          newPoint,
          newLat,
          newLong,
          startLat,
          startLong,
          clipPath,
          totalDistance,
        })
      );
    } else {
      dispatch(fetchSinglePoint([newLong, newLat], points));
    }
  };

  const handleDragEnd = (
    newLngLat: number[],
    point: number[],
    pointIndex: number
  ) => {
    const waypoints: number[][] = [];
    const lineIndices: number[] = [];

    // If only one point, update that points position
    if (points.length === 1) {
      dispatch(fetchSinglePoint(newLngLat, points));
      // else handle cases for for multiple points, beginning, middle, and end
    } else {
      if (pointIndex === 0) {
        // If you drag deginning point
        waypoints.push(newLngLat, points[1]);
        lineIndices.push(0);
      } else if (pointIndex === lines.length) {
        // If you drag the end point
        waypoints.push(points[points.length - 2], newLngLat);
        lineIndices.push(pointIndex);
      } else {
        // if you drag a middle point
        waypoints.push(
          points[pointIndex - 1],
          newLngLat,
          points[pointIndex + 1]
        );
        lineIndices.push(pointIndex - 1, pointIndex);
      }

      dispatch(
        updateRouteAfterDrag({
          pointIndex,
          waypoints,
          lineIndices,
        })
      );

      if (points.length > 1) {
        setIsDragging(false);
      }
      setPoint([]);
    }
  };

  const handleDrag = (event) => {
    setPoint(event.lngLat);
  };

  const handleDragStart = (event, index: number) => {
    if (points.length > 1) {
      setIsDragging(true);
    }
    setIndex(index);
  };

  useEffect(() => {
    if (distanceAlongPath !== 0) {
      const line = turf.lineString(lines.flat());

      const segment = turf.along(line, distanceAlongPath, { units });

      setPointAlongPath(segment.geometry.coordinates);
    } else {
      setPointAlongPath([]);
    }
  }, [distanceAlongPath]);

  useEffect(() => {
    const geo = navigator.geolocation;
    if (!geo) {
      console.log('no geo', geo);
      return;
    }

    console.log('finidng location');

    geo.getCurrentPosition((position) => {
      setViewport({
        ...viewport,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        zoom: 14,
      });
      setPosition([position.coords.latitude, position.coords.longitude]);
    });
  }, []);

  const handleHover = (event) => {
    const { features } = event;

    const hoveredFeature =
      features &&
      features.find((f) => f.layer.id.split('-')[0] === 'path_layer');

    if (hoveredFeature) {
      const line = turf.lineString(lines.flat());
      const segment = turf.lineSlice(points[0], event.lngLat, line);
      const length = turf.length(segment, { units });

      setDistanceAlongPath(length);
    } else if (distanceAlongPath !== 0) {
      setDistanceAlongPath(0);
    }
  };

  return (
    <MapContainer {...{ width, height }}>
      <Controls
        {...{ setClipPath, clipPath, showElevation, setShowElevation }}
      />
      <ElevationProfile
        {...{
          showElevation,
          lines,
          units,
          setDistanceAlongPath,
        }}
      />
      <ReactMapGL
        latitude={viewport.latitude}
        longitude={viewport.longitude}
        zoom={viewport.zoom}
        mapboxApiAccessToken={process.env.MAPBOX_TOKEN}
        reuseMap={true}
        width={'100%'}
        height={'100%'}
        style={{ display: 'flex', flex: '1' }}
        onClick={handleClick}
        onHover={handleHover}
        onViewportChange={(viewport) => setViewport(viewport)}
        mapStyle="mapbox://styles/mapbox/outdoors-v11"
      >
        {position.length > 0 && (
          <Marker longitude={position[1]} latitude={position[0]}>
            <UserMarker />
          </Marker>
        )}
        {isDragging && (
          <ConnectingLines points={points} index={index} endPoint={point} />
        )}
        <SvgPath points={lines} />
        {/* {lines.map((line, i) => (
          <GeoJsonPath key={i} {...{ line, i }} width={6} />
        ))} */}
        {/* <GeoJsonPath {...{ lines }} /> */}
        {points.map((point, i) => (
          <Marker
            key={i}
            longitude={point[0]}
            latitude={point[1]}
            draggable
            onDragStart={(event) => handleDragStart(event, i)}
            onDrag={(event) => handleDrag(event)}
            onDragEnd={(event) => handleDragEnd(event.lngLat, point, i)}
          >
            <Pin index={i} points={points} />
          </Marker>
        ))}
        <DistanceMarkers {...{ lines, units }} />
        {pointAlongPath.length ? (
          <Marker longitude={pointAlongPath[0]} latitude={pointAlongPath[1]}>
            <Label>{distanceAlongPath.toFixed(2)}</Label>
            <DistanceMarker />
          </Marker>
        ) : null}
        <div style={{ position: 'absolute', left: 16, top: 56 }}>
          <NavigationControl showCompass={false} />
        </div>
      </ReactMapGL>
      {isLoading && <LoadingIndicator />}
      <DistanceIndicator {...{ units, authenticated, lines }} />
    </MapContainer>
  );
};

const MapContainer = styled.div<{ width: number; height: number }>`
  height: ${(props) =>
    props.height > 0 ? `${props.height - 64}px` : 'calc(100vh - 64px)'};
  width: 100vw;
  display: flex;
  flex: 1;
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

const UserMarker = styled.div`
  height: 1.6rem;
  width: 1.6rem;
  background-color: ${(props) => props.theme.colors.primary};
  border: 2px solid #fff;
  border-radius: 50%;
  box-shadow: ${(props) => props.theme.boxShadow.sm};
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

export default connect((state) => state)(Map);
