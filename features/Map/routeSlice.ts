import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Dispatch, SetStateAction } from 'react';
import { AppThunk } from '../../app/store';
import { fetchRoutes } from '../../utils/fetchRoutes';

interface RouteState {
  points: number[][];
  lines: number[][][];
  startPoint: number[];
  endPoint: number[];
  totalDistance: number;
  segmentDistances: number[][];
  elevation: number[];
}

interface RouteParams {
  newPoint: number[];
  newLat: number;
  newLong: number;
  startLat: number;
  startLong: number;
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
  totalDistance: 0,
  segmentDistances: [],
  elevation: [],
};

const { actions, reducer } = createSlice({
  name: 'route',
  initialState,
  reducers: {
    addPoint: (state, action: PayloadAction<number[]>) => {
      state.points.push(action.payload);
    },
    clearRoute: state => {
      return initialState;
    },
    removeLastPoint: state => {
      return state;
    },
    addRoutingInfo: (state, action: PayloadAction<RoutingInfo>) => {
      const { distance, coordinates, newPoint } = action.payload;
      state.points.push(newPoint);
      state.lines.push(coordinates);
      state.totalDistance += distance;
    },
    updateStartAfterDrag: (state, action: PayloadAction<number[]>) => {
      state.points[0] = action.payload;
    },
    updateRouteAfterDragSuccess: (
      state,
      action: PayloadAction<UpdatedRouteResults>
    ) => {
      const { pointIndex, snappedWaypoints, line } = action.payload;
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
        state.points.splice(pointIndex, 1, snappedWaypoints[1]);
        state.lines.splice(pointIndex - 1, 2, line[0], line[1]);
      }
    },
  },
});

export const {
  addPoint,
  clearRoute,
  removeLastPoint,
  addRoutingInfo,
  updateStartAfterDrag,
  updateRouteAfterDragSuccess,
} = actions;

export const updateRouteAfterDrag = (
  newLngLat: number[],
  point: number[],
  pointIndex: number,
  waypoints: number[][],
  lineIndices: number[],
  setIsDragging: Dispatch<SetStateAction<boolean>>,
  setPoint: Dispatch<SetStateAction<number[]>>
): AppThunk => async dispatch => {
  try {
    const data = await fetchRoutes(waypoints);

    const { snapped_waypoints, points } = data;

    // first point in data.points.coordinates will be the starting point
    // last point in data.points.coordinates will be the ending point
    // You Need to find the index of the middle snapped waypoint and split the coordinates array into two new arrays

    // Use snapped_waypoints to identify center point in coordinates, as well as updated location of marker.
    // because the marker may be dragged away from a road where the line should nor render

    let middlePointIndex: number | undefined = undefined;
    const isMiddlePoint: boolean = snapped_waypoints.coordinates.length === 3;
    const lines: number[][][] = [];

    if (isMiddlePoint) {
      middlePointIndex = data.points.coordinates.findIndex(
        coord =>
          coord[0] === snapped_waypoints.coordinates[1][0] &&
          coord[1] === snapped_waypoints.coordinates[1][1]
      );

      const leftLine = data.points.coordinates.slice(0, middlePointIndex + 1);
      const rightLine = data.points.coordinates.slice(middlePointIndex);

      lines.push(leftLine, rightLine);
    } else {
      const { coordinates } = points;
      lines.push(coordinates);
    }

    dispatch(
      updateRouteAfterDragSuccess({
        pointIndex,
        snappedWaypoints: snapped_waypoints.coordinates,
        lineIndices,
        line: lines,
      })
    );
  } catch (e) {
    console.log(e);
  }
};

export const fetchSinglePoint = (
  newPoint: number[]
): AppThunk => async dispatch => {
  const data = await fetchRoutes([newPoint, newPoint]);
  dispatch(addPoint(data.snapped_waypoints.coordinates[0]));
};

export const addRoute = ({
  newPoint,
  newLat,
  newLong,
  startLat,
  startLong,
  transportationType,
  clipPath,
}: RouteParams): AppThunk => async dispatch => {
  const points = [
    [startLong, startLat],
    [newLong, newLat],
  ];

  try {
    const data = await fetchRoutes(points);

    const { coordinates } = data.points;

    dispatch(
      addRoutingInfo({
        distance: data.distance,
        coordinates,
        newPoint: data.snapped_waypoints.coordinates[1],
      })
    );
  } catch (e) {
    console.log(e);
  }
};

export default reducer;
