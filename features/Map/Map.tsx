import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as turf from '@turf/turf';
import ReactMapGL, { Marker } from 'react-map-gl';
import styled from 'styled-components';

import { RootState } from '../../app/rootReducer';
import { AppDispatch } from '../../app/store';
import { addRoute, updateRouteAfterDrag, fetchSinglePoint } from './routeSlice';

import SvgPath from './SvgPath';
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
  const [clipPath, setClipPath] = useState<boolean>(false);
  const [showElevation, setShowElevation] = useState<boolean>(false);
  const [viewport, setViewport] = useState<Viewport>({
    latitude: 34.105999576,
    longitude: -117.718497126,
    zoom: 14,
    bearing: 0,
    pitch: 0,
  });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [point, setPoint] = useState<number[]>([]);
  const [index, setIndex] = useState<number>(0);

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
    elevationData,
    authenticated,
    user: { units },
  } = useSelector((state: RootState) => ({
    isLoading: state.loading.isLoading,
    points: state.route.present.points,
    totalDistance: state.route.present.totalDistance,
    lines: state.route.present.lines,
    elevationData: state.route.present.elevationData,
    authenticated: state.auth.authenticated,
    user: state.auth.user,
  }));

  const handleClick = event => {
    const [newLong, newLat] = event.lngLat;

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
          elevationData,
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
          numberOfPoints: points.length - 1,
          elevationData,
        })
      );

      if (points.length > 1) {
        setIsDragging(false);
      }
      setPoint([]);
    }
  };

  const handleDrag = event => {
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

  return (
    <MapContainer>
      <Controls
        {...{ setClipPath, clipPath, showElevation, setShowElevation }}
      />
      <ElevationProfile
        {...{
          showElevation,
          elevationData,
          lines,
          units,
          setDistanceAlongPath,
        }}
      />
      <ReactMapGL
        {...viewport}
        mapboxApiAccessToken={process.env.MAPBOX_TOKEN}
        reuseMap={true}
        width={'100%'}
        height={'100%'}
        style={{ display: 'flex', flex: '1' }}
        onClick={handleClick}
        onViewportChange={viewport => setViewport(viewport)}
        mapStyle="mapbox://styles/mapbox/outdoors-v10"
      >
        {isDragging && (
          <ConnectingLines points={points} index={index} endPoint={point} />
        )}
        <SvgPath points={lines} />
        {/* <GeoJsonPath {...{ lines }} /> */}
        {points.map((point, i) => (
          <Marker
            key={i}
            longitude={point[0]}
            latitude={point[1]}
            draggable
            onDragStart={event => handleDragStart(event, i)}
            onDrag={event => handleDrag(event)}
            onDragEnd={event => handleDragEnd(event.lngLat, point, i)}
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
      </ReactMapGL>
      {isLoading && <LoadingIndicator />}
      <DistanceIndicator {...{ elevationData, units, authenticated }} />
    </MapContainer>
  );
};

const MapContainer = styled.div`
  height: calc(100vh - ${props => props.theme.navHeight});
  width: 100vw;
  display: flex;
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
  border: 2px solid ${props => props.theme.colors.indigo[500]};
  transform: translate3d(-50%, -50%, 0);
`;

export default Map;
