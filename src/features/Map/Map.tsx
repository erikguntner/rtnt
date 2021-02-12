import React, { useState, useEffect, useRef } from 'react';
import { connect, useSelector, useDispatch } from 'react-redux';
import * as turf from '@turf/turf';
import ReactMapGL, { Marker, NavigationControl, MapEvent } from 'react-map-gl';
import { CallbackEvent } from 'react-map-gl/src/components/draggable-control';
import styled from 'styled-components';

import { RootState } from '../../reducers/rootReducer';
import { AppDispatch } from '../../reducers/store';
import {
  addRoute,
  updateRouteAfterDrag,
  fetchSinglePoint,
  updatePointCoords,
} from './routeSlice';
import { updateViewport } from './viewportSlice';
import useWindowSize from '../../utils/useWindowSize';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationArrow } from '@fortawesome/free-solid-svg-icons';

import SvgPath from './SvgPath';
import ConnectingLines from './ConnectingLines';
import UpdatedElevationProfile from './UpdatedElevationProfile';
import Controls from './Controls';
import Pin from './Pin';
import DistanceMarkers from './DistanceMarkers';
import DistanceIndicator from './DistanceIndicator';
import LoadingIndicator from './LoadingIndicator';
import CrossHairs from './CrossHairs';
import { Spinner } from '../Forms/styles';

interface Viewport {
  latitude: number;
  longitude: number;
  zoom: number;
  bearing: number;
  pitch: number;
}
const Map = () => {
  const dispatch: AppDispatch = useDispatch();
  const {
    isLoading,
    points,
    distance,
    lines,
    authenticated,
    user: { units },
    viewport,
    initialLoad,
  } = useSelector((state: RootState) => ({
    isLoading: state.loading.isLoading,
    points: state.route.present.points,
    distance: state.route.present.distance,
    lines: state.route.present.lines,
    authenticated: state.auth.authenticated,
    user: state.auth.user,
    viewport: state.viewport.viewport,
    initialLoad: state.viewport.initialLoad,
  }));

  const [width, height] = useWindowSize();
  const [mapFocus, setMapFocus] = useState<boolean>(false);
  const [clipPath, setClipPath] = useState<boolean>(false);
  const [userLocation, setUserLocation] = useState<number[]>([]);
  const [userLocationLoading, setUserLocationLoading] = useState<boolean>(
    false
  );
  const [showElevation, setShowElevation] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [index, setIndex] = useState<number>(0);
  const mapRef = useRef(null);
  // state for syncing mouseevents for chart and map
  const [distanceAlongPath, setDistanceAlongPath] = useState<number>(0);
  const [pointAlongPath, setPointAlongPath] = useState<number[]>([]);

  const handleClick = (lngLat: number[]) => {
    const [newLong, newLat] = lngLat;
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
          distance,
        })
      );
    } else {
      dispatch(fetchSinglePoint([newLong, newLat], points));
    }
  };

  const handleDragStart = (event: CallbackEvent, index: number) => {
    if (points.length > 1) {
      setIsDragging(true);
    }
    setIndex(index);
  };

  const handleDrag = (event: CallbackEvent, index: number) => {
    dispatch(updatePointCoords({ index, coords: event.lngLat }));
  };

  const handleDragEnd = (
    event: CallbackEvent,
    point: number[],
    pointIndex: number
  ) => {
    const newLngLat = event.lngLat;
    // array of start point, stops, and endpoints from which to calculate the new line
    const waypoints: number[][] = [];
    // index of lines to replace
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
        lineIndices.push(pointIndex - 1);
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
          lines,
          lineIndices,
        })
      );

      if (points.length > 1) {
        setIsDragging(false);
      }
    }
  };

  const calculateNewLngLat = (lngOrLat: number, meters: number): number => {
    const earth = 6378.137; //radius of the earth in kilometer
    const pi = Math.PI;
    const m = 1 / (((2 * pi) / 360) * earth) / 1000;
    return lngOrLat + meters * m;
  };

  useEffect(() => {
    if (distanceAlongPath !== 0) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      //@ts-ignore
      const line = turf.lineString(lines.flat());

      const segment = turf.along(line, distanceAlongPath, { units });

      setPointAlongPath(segment.geometry.coordinates);
    } else {
      setPointAlongPath([]);
    }
  }, [distanceAlongPath]);

  const getLocation = (updatePosition = false) => {
    setUserLocationLoading(true);
    const geo = navigator.geolocation;
    if (!geo) {
      setUserLocationLoading(false);
      return;
    }

    const onSuccess = (position) => {
      // set viewport to user's location on first load, but not when coming back from another page
      if (!initialLoad || updatePosition) {
        dispatch(
          updateViewport({
            ...viewport,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            zoom: 14,
          })
        );
      }

      setUserLocation([position.coords.latitude, position.coords.longitude]);
      setUserLocationLoading(false);
    };

    const onError = () => {
      setUserLocationLoading(false);
    };

    geo.getCurrentPosition(onSuccess, onError);
  };

  useEffect(() => {
    getLocation();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const map = mapRef.current.getMap();
      const center: { lng: number; lat: number } = map.transform._center;

      // control map with arrow keys while focused
      console.log(e.code);
      if (e.keyCode === 9) {
        if (document.activeElement.className === 'mapboxgl-canvas') {
          setMapFocus(true);
        } else {
          if (mapFocus === true) {
            setMapFocus(false);
          }
        }
      } else if (e.keyCode === 32) {
        if (document.activeElement.className === 'mapboxgl-canvas') {
          const lngLat: number[] = [center.lng, center.lat];
          handleClick(lngLat);
        }
      } else if (e.keyCode === 38) {
        const newLat = calculateNewLngLat(center.lat, 40);
        dispatch(updateViewport({ ...viewport, latitude: newLat }));
      } else if (e.keyCode === 40) {
        const newLat = calculateNewLngLat(center.lat, -40);
        dispatch(updateViewport({ ...viewport, latitude: newLat }));
      } else if (e.keyCode === 37) {
        const newLng = calculateNewLngLat(center.lng, -40);
        dispatch(updateViewport({ ...viewport, longitude: newLng }));
      } else if (e.keyCode === 39) {
        const newLng = calculateNewLngLat(center.lng, 40);
        dispatch(updateViewport({ ...viewport, longitude: newLng }));
      }
    };

    window.addEventListener('keyup', handleKeyDown);

    return () => {
      window.removeEventListener('keyup', handleKeyDown);
    };
  }, [mapFocus, points, viewport]);

  return (
    <MapContainer {...{ width, height }}>
      <Controls
        {...{ setClipPath, clipPath, showElevation, setShowElevation }}
      />
      <ElevationWrapper>
        <UpdatedElevationProfile
          {...{
            showElevation,
            lines,
            units,
            setDistanceAlongPath,
          }}
        />
      </ElevationWrapper>
      <ReactMapGL
        latitude={viewport.latitude}
        longitude={viewport.longitude}
        zoom={viewport.zoom}
        mapboxApiAccessToken={process.env.MAPBOX_TOKEN}
        reuseMaps={true}
        width={'100%'}
        height={'100%'}
        style={{ display: 'flex', flex: '1' }}
        onClick={({ lngLat }: MapEvent) => handleClick(lngLat)}
        ref={mapRef}
        keyboard={false}
        className="map"
        data-testid="map-id"
        onViewportChange={({ latitude, longitude, zoom, bearing, pitch }) =>
          dispatch(
            updateViewport({ latitude, longitude, zoom, bearing, pitch })
          )
        }
        mapStyle="mapbox://styles/mapbox/outdoors-v11"
      >
        {userLocation.length > 0 && (
          <Marker longitude={userLocation[1]} latitude={userLocation[0]}>
            <UserMarker />
          </Marker>
        )}
        {isDragging && <ConnectingLines points={points} index={index} />}
        <SvgPath points={lines} />
        <DistanceMarkers {...{ lines, units }} />
        {points.map((point, i) => (
          <Marker
            key={i}
            longitude={point[0]}
            latitude={point[1]}
            draggable
            onDragStart={(event: CallbackEvent) => handleDragStart(event, i)}
            onDrag={(event: CallbackEvent) => handleDrag(event, i)}
            onDragEnd={(event: CallbackEvent) => handleDragEnd(event, point, i)}
          >
            <Pin index={i} points={points} />
          </Marker>
        ))}
        {pointAlongPath.length ? (
          <Marker longitude={pointAlongPath[0]} latitude={pointAlongPath[1]}>
            <Label>{distanceAlongPath.toFixed(2)}</Label>
            <DistanceMarker />
          </Marker>
        ) : null}
        <MapControls>
          <NavigationControl showCompass={false} />
        </MapControls>
      </ReactMapGL>
      <GeolocationButton
        disabled={userLocationLoading}
        onClick={() => getLocation(true)}
      >
        {userLocationLoading ? (
          <Spinner />
        ) : (
          <FontAwesomeIcon icon={faLocationArrow} />
        )}
      </GeolocationButton>
      {mapFocus && <CrossHairs />}
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

  &:focus {
    outline: none;
    border: 4px solid red;
  }

  @media screen and (max-width: ${(props) => props.theme.screens.md}) {
    &:focus {
      outline: none;
      border: none;
    }
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

const MapControls = styled.div`
  position: absolute;
  left: 16px;
  top: 96px;
  display: flex;
  align-items: center;
`;

const GeolocationButton = styled.button`
  position: absolute;
  left: 16px;
  top: 96px;
  width: 30px;
  height: 30px;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  border-radius: 6px;
  box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);

  &:hover {
    cursor: pointer;
  }
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

const ElevationWrapper = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 35vh;
  width: 100%;

  @media screen and (max-width: ${(props) => props.theme.screens.md}) {
    height: 25vh;
  }
`;

export default connect((state) => state)(Map);
