import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ReactMapGL, { Marker } from 'react-map-gl';
import styled from 'styled-components';
import WebMercatorViewport from 'viewport-mercator-project';
import * as turfHelpers from '@turf/helpers';
import bbox from '@turf/bbox';

import { RootState } from '../../app/rootReducer';
import { AppDispatch } from '../../app/store';
import {
  addPoint,
  addRoute,
  updateRouteAfterDrag,
  updateStartAfterDrag,
  fetchSinglePoint,
} from './routeSlice';

import SVGOverlay from './SVGOverlay';
import ConnectingLines from './ConnectingLines';
import ElevationProfile from './ElevationProfile';
import Controls from './Controls';
import Pin from './Pin';

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

  const dispatch: AppDispatch = useDispatch();
  const { points, totalDistance } = useSelector((state: RootState) => ({
    points: state.route.present.points,
    totalDistance: state.route.present.totalDistance,
  }));
  const { lines } = useSelector((state: RootState) => ({
    lines: state.route.present.lines,
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
          clipPath,
        })
      );
    } else {
      dispatch(fetchSinglePoint([newLong, newLat]));
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
      dispatch(updateStartAfterDrag(newLngLat));
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
        updateRouteAfterDrag(
          newLngLat,
          point,
          pointIndex,
          waypoints,
          lineIndices,
          setIsDragging,
          setPoint
        )
      );

      setIsDragging(false);
      setPoint([]);
    }
  };

  const handleDrag = (event, index: number) => {
    setPoint(event.lngLat);
  };

  const handleDragStart = (event, index: number) => {
    setIsDragging(true);
    setIndex(index);
  };

  return (
    <MapContainer>
      <Controls
        {...{ setClipPath, clipPath, showElevation, setShowElevation }}
      />
      <ElevationProfile {...{ showElevation, lines, totalDistance }} />
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
        <SVGOverlay points={lines} />
        {points.map((point, i) => (
          <Marker
            key={i}
            longitude={point[0]}
            latitude={point[1]}
            draggable
            onDragStart={event => handleDragStart(event, i)}
            onDrag={event => handleDrag(event, i)}
            onDragEnd={event => handleDragEnd(event.lngLat, point, i)}
          >
            <Pin index={i} size={20} points={points} />
          </Marker>
        ))}
      </ReactMapGL>
    </MapContainer>
  );
};

const MapContainer = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

export default Map;
