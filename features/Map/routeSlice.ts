import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AppThunk } from '../../app/store';
import { changeNotificationStatus } from './notificationSlice';

interface RouteState {
  points: number[][];
  lines: number[][][];
  startPoint: number[];
  endPoint: number[];
  totalDistance: number[];
  segmentDistances: number[][];
}

interface RouteParams {
  newPoint: number[];
  newLat: number;
  newLong: number;
  startLat: number;
  startLong: number;
  totalDistance: number[];
  transportationType?: string;
  clipPath: boolean;
}

interface RoutingInfo {
  distance: number;
  coordinates: number[][];
  newPoint: number[];
}

interface UpdatedRouteResults {
  pointIndex: number;
  snappedWaypoints: number[][];
  lineIndices: number[];
  line: number[][][];
}

export const initialState: RouteState = {
  points: [],
  lines: [],
  startPoint: [],
  endPoint: [],
  totalDistance: [0],
  segmentDistances: [],
};

const { actions: loadingActions, reducer: loadingReducer } = createSlice({
  name: 'loading',
  initialState: { isLoading: false },
  reducers: {
    changeLoadingState: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export { loadingReducer };

const { actions, reducer } = createSlice({
  name: 'route',
  initialState,
  reducers: {
    addPoint: (state, action: PayloadAction<number[]>) => {
      state.points.push(action.payload);
    },
    clearRoute: () => {
      return initialState;
    },
    removeLastPoint: state => {
      return state;
    },
    addRoutingInfo: (state, action: PayloadAction<RoutingInfo>) => {
      const { distance, coordinates, newPoint } = action.payload;
      state.points.push(newPoint);
      state.lines.push(coordinates);
      state.totalDistance.push(
        state.totalDistance[state.totalDistance.length - 1] + distance
      );
    },
    updatePointCoords: (state, action: PayloadAction<{ index: number; coords: number[] }>) => {
      const { index, coords } = action.payload;
      state.points[index] = coords;
    },
    updateStartAfterDrag: (state, action: PayloadAction<number[]>) => {
      state.points[0] = action.payload;
    },
    updateRouteAfterDragSuccess: (
      state,
      action: PayloadAction<UpdatedRouteResults>
    ) => {
      const {
        pointIndex,
        snappedWaypoints,
        line,
      } = action.payload;
      if (pointIndex === 0) {
        // drag first point
        state.points[0] = snappedWaypoints[0];
        state.lines[0] = line[0];
      } else if (pointIndex === state.points.length - 1) {
        // drag last point
        state.points[state.points.length - 1] = snappedWaypoints[1];
        state.lines[state.lines.length - 1] = line[0];
      } else {
        // drag a middle point
        state.points[pointIndex] = snappedWaypoints[1];
        state.lines[pointIndex - 1] = line[0];
        state.lines[pointIndex] = line[1];
      }
    },
  },
});

export const { changeLoadingState } = loadingActions;

export const {
  addPoint,
  clearRoute,
  removeLastPoint,
  addRoutingInfo,
  updatePointCoords,
  updateStartAfterDrag,
  updateRouteAfterDragSuccess,
} = actions;

export const fetchSinglePoint = (
  newPoint: number[],
  points: number[][]
): AppThunk => async dispatch => {
  try {
    dispatch(changeLoadingState(true));
    const pointString = [newPoint, newPoint]
      .map(point => `point=${point[1]},${point[0]}&`)
      .join('');

    const response = await fetch(
      `https://graphhopper.com/api/1/route?${pointString}vehicle=foot&debug=true&elevation=true&legs=true&details=street_name&key=${process.env.GRAPH_HOPPER_KEY}&type=json&points_encoded=false`
    );
    const data = await response.json();

    const {
      snapped_waypoints,
    } = data.paths[0];

    if (points.length === 0) {
      dispatch(addPoint(snapped_waypoints.coordinates[0]));
    } else {
      dispatch(updateStartAfterDrag(snapped_waypoints.coordinates[0]));
    }
    dispatch(changeLoadingState(false));
  } catch (e) {
    dispatch(
      changeNotificationStatus({
        isVisible: true,
        type: 'error',
        message: 'Looks like there was an error on our end',
      })
    );
    dispatch(changeLoadingState(false));
  }
};

interface Instructions {
  distance: number;
  heading: number;
  sign: number;
  interval: number[];
  text: string;
  time: number;
  street_name: string;
}

const createLineSegments = (coordinates, waypoints): number[][][] => {
  const lines = [];
  let middlePointIndex: number | undefined = undefined;
  const isMiddlePoint: boolean = waypoints.coordinates.length === 3;

  if (isMiddlePoint) {
    middlePointIndex = coordinates.findIndex(
      coord =>
        coord[0] === waypoints.coordinates[1][0] &&
        coord[1] === waypoints.coordinates[1][1]
    );

    const leftLine = coordinates.slice(0, middlePointIndex + 1);
    const rightLine = coordinates.slice(middlePointIndex);

    lines.push(leftLine, rightLine);
  } else {
    lines.push(coordinates);
  }

  return lines;
};

interface DragParams {
  pointIndex: number;
  waypoints: number[][];
  lineIndices: number[];
}

export const updateRouteAfterDrag = ({
  pointIndex,
  waypoints,
  lineIndices,
}: DragParams): AppThunk => async dispatch => {
  try {
    dispatch(changeLoadingState(true));

    const pointString = waypoints
      .map(point => `point=${point[1]},${point[0]}&`)
      .join('');

    const response = await fetch(
      `https://graphhopper.com/api/1/route?${pointString}vehicle=foot&debug=true&elevation=true&legs=true&details=street_name&key=${process.env.GRAPH_HOPPER_KEY}&type=json&points_encoded=false`
    );
    const data = await response.json();

    const {
      snapped_waypoints,
      points: { coordinates },
    } = data.paths[0];

    const lines: number[][][] = createLineSegments(
      coordinates,
      snapped_waypoints
    );

    dispatch(
      updateRouteAfterDragSuccess({
        pointIndex,
        snappedWaypoints: snapped_waypoints.coordinates,
        lineIndices,
        line: lines,
      })
    );
    dispatch(changeLoadingState(false));
  } catch (e) {
    dispatch(
      changeNotificationStatus({
        isVisible: true,
        type: 'error',
        message: 'Looks like there was an error on our end',
      })
    );
    dispatch(changeLoadingState(false));
  }
};

export const addRoute = ({
  newLat,
  newLong,
  startLat,
  startLong,
}: RouteParams): AppThunk => async dispatch => {
  const points = [
    [startLong, startLat],
    [newLong, newLat],
  ];

  try {
    dispatch(changeLoadingState(true));

    const pointString = points
      .map(point => `point=${point[1]},${point[0]}&`)
      .join('');

    const response = await fetch(
      `https://graphhopper.com/api/1/route?${pointString}vehicle=foot&debug=true&elevation=true&legs=true&details=street_name&key=${process.env.GRAPH_HOPPER_KEY}&type=json&points_encoded=false`
    );
    const data = await response.json();

    const { coordinates } = data.paths[0].points;
    const { distance, snapped_waypoints } = data.paths[0];

    dispatch(
      addRoutingInfo({
        distance,
        coordinates,
        newPoint: snapped_waypoints.coordinates[1],
      })
    );
    dispatch(changeLoadingState(false));
  } catch (e) {
    console.log(e);
    dispatch(
      changeNotificationStatus({
        isVisible: true,
        type: 'error',
        message: 'Looks like there was an error on our end',
      })
    );
    dispatch(changeLoadingState(false));
  }
};

/////////////////////////
// SAGAS
/////////////////////////

export function* addPointSaga() {
  console.log('adding point');
}


export default reducer;
