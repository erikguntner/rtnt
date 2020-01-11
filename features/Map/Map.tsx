import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ReactMapGL, { Marker } from 'react-map-gl';
import styled from 'styled-components';
import WebMercatorViewport from 'viewport-mercator-project';
import * as turfHelpers from '@turf/helpers';
// import center from '@turf/center';
import bbox from '@turf/bbox';
// import "mapbox-gl/src/css/mapbox-gl.css";

import { RootState } from '../../app/rootReducer';
import { AppDispatch } from '../../app/store';
// import { addPoint, addRoute } from './routeReducer';
import { addPoint, addRoute } from './routeSlice';

import PolylineOverlay from './PolylineOverlay';
import SvgOverlay from './SvgOverlay';
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
  const [viewport, setViewport] = useState<Viewport>({
    latitude: 34.105999576,
    longitude: -117.718497126,
    zoom: 14,
    bearing: 0,
    pitch: 0,
  });

  const dispatch: AppDispatch = useDispatch();
  const { points } = useSelector((state: RootState) => ({
    points: state.route.present.points,
  }));
  const { lines } = useSelector((state: RootState) => ({
    lines: state.route.present.lines,
  }));

  const handleClick = event => {
    // if (event.target.classList.contains("mapboxgl-ctrl-icon")) {
    //   navigator.geolocation.getCurrentPosition(position => {
    //     updateViewport({
    //       ...viewport,
    //       longitude: position.coords.longitude,
    //       latitude: position.coords.latitude
    //     });
    //   });
    //   return;
    // }

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
      dispatch(addPoint([newLong, newLat]));
    }
  };

  const onMarkerDragEnd = event => {};

  return (
    <MapContainer>
      <Controls {...{ setClipPath, clipPath }} />
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
        <PolylineOverlay points={lines} />
        {points.map((point, i) => (
          <Marker
            key={i}
            longitude={point[0]}
            latitude={point[1]}
            offsetTop={-20}
            offsetLeft={-10}
            draggable
            onDragStart={() => {}}
            onDrag={() => {}}
            onDragEnd={onMarkerDragEnd}
          >
            <Pin size={20} />
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
