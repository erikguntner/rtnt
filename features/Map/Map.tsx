import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as turf from '@turf/turf';
import ReactMapGL, { Marker } from 'react-map-gl';
import styled from 'styled-components';
import WebMercatorViewport from 'viewport-mercator-project';

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
  const [distanceMarkers, setDistanceMarkers] = useState<number[][]>([]);
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
  const { points, totalDistance, lines, elevationData } = useSelector(
    (state: RootState) => ({
      points: state.route.present.points,
      totalDistance: state.route.present.totalDistance,
      lines: state.route.present.lines,
      elevationData: state.route.present.elevationData,
    })
  );

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
          totalDistance,
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

  useEffect(() => {
    // calculate distance markers
    if (lines.length > 0) {
      const line = turf.lineString(lines.flat());
      let routeDistance = turf.length(line, { units: 'miles' });
      routeDistance = Math.floor(routeDistance);
      const markers = [];

      if (routeDistance !== 0) {
        for (let i = 0; i < routeDistance + 1; i++) {
          const segment = turf.along(line, i, { units: 'miles' });

          if (i !== 0) {
            markers.push(segment.geometry.coordinates);
          }
        }
        setDistanceMarkers(markers);
      } else {
        setDistanceMarkers([]);
      }
    }
  }, [lines]);

  return (
    <MapContainer>
      <Controls
        {...{ setClipPath, clipPath, showElevation, setShowElevation }}
      />
      <ElevationProfile {...{ showElevation, elevationData, totalDistance }} />
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
        {distanceMarkers.map((point, i) => (
          <Marker key={i} longitude={point[0]} latitude={point[1]}>
            <DistanceMarker>{i + 1}</DistanceMarker>
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

const DistanceMarker = styled.div`
  font-size: 1rem;
  line-height: 1;
  background-color: #fff;
  padding: 1px 2px;
  border-radius: 3px;
  border: 2px solid ${props => props.theme.colors.indigo[500]};
  transform: translate3d(-50%, -50%, 0);
`;

export default Map;
