import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  MutableRefObject,
  useMemo,
} from 'react';
import { connect, useSelector, useDispatch } from 'react-redux';
import * as turf from '@turf/turf';
import ReactMapGL, {
  Marker,
  NavigationControl,
  WebMercatorViewport,
} from 'react-map-gl';
import { CallbackEvent } from 'react-map-gl/src/components/draggable-control';
import styled from 'styled-components';
import ResizeObserver from 'resize-observer-polyfill';

import { RootState } from '../../reducers/rootReducer';
import { AppDispatch } from '../../reducers/store';
import {
  addRoute,
  updateRouteAfterDrag,
  fetchSinglePoint,
  updatePointCoords,
} from './routeSlice';
import { updateViewport } from './viewportSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationArrow } from '@fortawesome/free-solid-svg-icons';

// import SvgPath from './SvgPath';
import ConnectingLines from './ConnectingLines';
import UpdatedElevationProfile from './UpdatedElevationProfile';
import Controls from './Controls';
import Pin from './Pin';
import DistanceMarkers from './DistanceMarkers';
import DistanceIndicator from './DistanceIndicator';
import LoadingIndicator from './LoadingIndicator';
import CrossHairs from './CrossHairs';
import { Spinner } from '../Forms/styles';
import { changeNotificationStatus } from '../Notifications/notificationSlice';
import GeoJsonPath from './GeoJsonPath';
import AddDestinationMarker from './AddDestinationMarker';
import { State } from 'react-map-gl/src/components/interactive-map';
import { GraphQLBoolean } from 'graphql';

interface Viewport {
  latitude: number;
  longitude: number;
  zoom: number;
  bearing: number;
  pitch: number;
}

interface Dimensions {
  width: number;
  height: number;
}

const useResizeObserver = (
  ref: MutableRefObject<HTMLDivElement>
): Dimensions => {
  const [dimensions, setDimensions] = useState<Dimensions | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    const observerTarget = ref.current;
    const resizeObserver = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      setDimensions({ width, height });
    });
    resizeObserver.observe(observerTarget);
    return () => {
      resizeObserver.unobserve(observerTarget);
    };
  }, [ref]);
  return dimensions;
};

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
  } = useSelector((state: RootState) => ({
    isLoading: state.loading.isLoading,
    points: state.route.present.points,
    distance: state.route.present.distance,
    lines: state.route.present.lines,
    authenticated: state.auth.authenticated,
    user: state.auth.user,
    viewport: state.viewport.viewport,
  }));

  const [mapFocus, setMapFocus] = useState<boolean>(false);
  const [clipPath, setClipPath] = useState<boolean>(false);
  const [userLocation, setUserLocation] = useState<number[]>([]);
  const [userLocationLoading, setUserLocationLoading] = useState<boolean>(
    false
  );
  const [showElevation, setShowElevation] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [index, setIndex] = useState<number>(0);
  // state for syncing mouseevents for chart and map
  const [distanceAlongPath, setDistanceAlongPath] = useState<number>(0);
  const [pointAlongPath, setPointAlongPath] = useState<number[]>([]);
  const [searchDestination, setSearchDestination] = useState<number[] | null>(
    null
  );
  const [hoverInfo, setHoverInfo] = useState<null | {
    lng: number;
    lat: number;
    x: number;
    y: number;
  }>(null);
  const [draggingHoverInfo, setDraggingHoverInfo] = useState<boolean>(false);

  const mapRef = useRef(null);
  const viewRef = useRef(null);
  const dimensions = useResizeObserver(viewRef);

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

  const getLocation = () => {
    const geo = navigator.geolocation;
    if (!geo) {
      dispatch(
        changeNotificationStatus({
          isVisible: true,
          type: 'error',
          message: 'Your web browser does not support geolocation',
        })
      );
      return;
    }

    setUserLocationLoading(true);

    const onSuccess = (position) => {
      dispatch(
        updateViewport({
          ...viewport,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          zoom: 14,
        })
      );

      setUserLocation([position.coords.latitude, position.coords.longitude]);
      setUserLocationLoading(false);
    };

    const onError = () => {
      dispatch(
        changeNotificationStatus({
          isVisible: true,
          type: 'error',
          message:
            'Looks like geolocation is disabled in your browser. Please enable in order to use location features',
        })
      );
      setUserLocationLoading(false);
    };

    geo.getCurrentPosition(onSuccess, onError);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const map = mapRef.current.getMap();
      const center: { lng: number; lat: number } = map.transform._center;

      // control map with arrow keys while focused
      if (e.code === 'Tab') {
        if (document.activeElement.className === 'mapboxgl-canvas') {
          setMapFocus(true);
        } else {
          if (mapFocus === true) {
            setMapFocus(false);
          }
        }
      } else if (e.code === 'Space') {
        if (document.activeElement.className === 'mapboxgl-canvas') {
          const lngLat: number[] = [center.lng, center.lat];
          handleClick(lngLat);
        }
      } else if (e.code === 'ArrowUp') {
        const newLat = calculateNewLngLat(center.lat, 40);
        dispatch(updateViewport({ ...viewport, latitude: newLat }));
      } else if (e.code === 'ArrowDown') {
        const newLat = calculateNewLngLat(center.lat, -40);
        dispatch(updateViewport({ ...viewport, latitude: newLat }));
      } else if (e.code === 'ArrowLeft') {
        const newLng = calculateNewLngLat(center.lng, -40);
        dispatch(updateViewport({ ...viewport, longitude: newLng }));
      } else if (e.code === 'ArrowRight') {
        const newLng = calculateNewLngLat(center.lng, 40);
        dispatch(updateViewport({ ...viewport, longitude: newLng }));
      }
    };

    window.addEventListener('keyup', handleKeyDown);

    return () => {
      window.removeEventListener('keyup', handleKeyDown);
    };
  }, [mapFocus, points, viewport]);

  const onHover = useCallback(
    (event) => {
      const {
        features,
        srcEvent: { offsetX, offsetY },
      } = event;
      const hoveredFeature = features && features[0];

      const v = new WebMercatorViewport({
        ...viewport,
        width: dimensions.width,
        height: dimensions.height,
      });

      const [lng, lat] = v.unproject([offsetX, offsetY]); // returns [lng,lat]\
      if (!draggingHoverInfo) {
        setHoverInfo(
          hoveredFeature ? { lng, lat, x: offsetX, y: offsetY } : null
        );
      }
    },
    [setHoverInfo, viewport, dimensions, draggingHoverInfo]
  );

  const onMouseDown = useCallback((event) => {
    const { features } = event;
    const mousedFeature = features && features[0];
  }, []);

  const locateSearchDestination = (location: number[]) => {
    const [longitude, latitude] = location;
    dispatch(updateViewport({ ...viewport, zoom: 14, latitude, longitude }));
    setSearchDestination(location);
  };

  const renderPoints = useMemo(
    () =>
      points.map((point, i) => (
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
      )),
    [points]
  );

  return (
    <MapContainer>
      <Controls
        {...{
          setClipPath,
          clipPath,
          showElevation,
          setShowElevation,
          locateSearchDestination,
        }}
      />
      <div ref={viewRef} style={{ height: '100%', width: '100%' }}>
        <ReactMapGL
          {...viewport}
          mapboxApiAccessToken={process.env.MAPBOX_TOKEN}
          reuseMaps={true}
          width="100%"
          height="100%"
          onClick={({ lngLat }) => handleClick(lngLat)}
          ref={mapRef}
          keyboard={false}
          className="map"
          data-testid="map-id"
          getCursor={({ isDragging, isHovering }: State) => {
            return isHovering
              ? 'pointer'
              : isDragging
              ? 'grabbing'
              : 'crosshair';
          }}
          interactiveLayerIds={lines.map((_, i) => `path_layer_${i}`)}
          onViewportChange={({ latitude, longitude, zoom, bearing, pitch }) =>
            dispatch(
              updateViewport({ latitude, longitude, zoom, bearing, pitch })
            )
          }
          mapStyle="mapbox://styles/mapbox/outdoors-v11"
          onHover={onHover}
          onMouseDown={onMouseDown}
        >
          {hoverInfo || draggingHoverInfo ? (
            <Marker
              latitude={hoverInfo.lat}
              longitude={hoverInfo.lng}
              draggable
              onDragStart={() => setDraggingHoverInfo(true)}
              onDrag={(event: CallbackEvent) => {
                const [lng, lat] = event.lngLat;
                setHoverInfo({ ...hoverInfo, lng, lat });
              }}
              onDragEnd={() => setDraggingHoverInfo(false)}
            >
              <HoverInfo></HoverInfo>
            </Marker>
          ) : null}
          {userLocation.length > 0 && (
            <Marker longitude={userLocation[1]} latitude={userLocation[0]}>
              <UserMarker />
            </Marker>
          )}
          {isDragging && <ConnectingLines points={points} index={index} />}
          <GeoJsonPath lines={lines} />
          {searchDestination !== null ? (
            <AddDestinationMarker
              cancel={() => {
                setSearchDestination(null);
              }}
              addToRoute={() => {
                handleClick(searchDestination);
                setSearchDestination(null);
              }}
              location={searchDestination}
            />
          ) : null}

          <DistanceMarkers {...{ lines, units }} />
          {renderPoints}
          {pointAlongPath.length ? (
            <Marker longitude={pointAlongPath[0]} latitude={pointAlongPath[1]}>
              <Label>{distanceAlongPath.toFixed(2)}</Label>
              <DistanceMarker />
            </Marker>
          ) : null}
          <MapControls>
            <NavigationControl showCompass={false} />
          </MapControls>
          {mapFocus && <CrossHairs />}
        </ReactMapGL>
      </div>
      {showElevation && (
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
      )}
      <GeolocationButton disabled={userLocationLoading} onClick={getLocation}>
        {userLocationLoading ? (
          <Spinner />
        ) : (
          <FontAwesomeIcon icon={faLocationArrow} />
        )}
      </GeolocationButton>
      {isLoading && <LoadingIndicator />}
      <DistanceIndicator {...{ units, authenticated, lines }} />
    </MapContainer>
  );
};

const MapContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 64px);
  overflow: hidden;

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

const HoverInfo = styled.div`
  position: absolute;
  height: 12px;
  width: 12px;
  transform: translate3d(-50%, -50%, 0);
  border-radius: 50%;
  background-color: red;
  pointer-events: none;
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
  left: 1.6rem;
  top: 8rem;
  display: flex;
  align-items: center;

  @media screen and (max-width: ${(props) => props.theme.screens.md}) {
    top: 8.6rem;
  }
`;

const GeolocationButton = styled.button`
  position: absolute;
  left: 1.6rem;
  top: 13.6rem;
  width: 3rem;
  height: 3rem;
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
  transform: translateX(-50%);
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
