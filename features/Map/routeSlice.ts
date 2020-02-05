import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Dispatch, SetStateAction } from 'react';
import { AppThunk } from '../../app/store';
import { fetchRoutes } from '../../utils/fetchRoutes';

interface ElevationData {
  distance: number;
  elevation: number;
}

interface RouteState {
  points: number[][];
  lines: number[][][];
  startPoint: number[];
  endPoint: number[];
  totalDistance: number[];
  segmentDistances: number[][];
  elevationData: ElevationData[][];
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
  elevationData: ElevationData[][];
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
  elevationData: [],
};

const { actions, reducer } = createSlice({
  name: 'route',
  initialState,
  reducers: {
    addPoint: (state, action: PayloadAction<number[]>) => {
      state.points.push(action.payload);
      state.elevationData.push([
        {
          distance: 0,
          elevation: action.payload[2],
        },
      ]);
    },
    clearRoute: state => {
      return initialState;
    },
    removeLastPoint: state => {
      return state;
    },
    addRoutingInfo: (state, action: PayloadAction<RoutingInfo>) => {
      const { distance, coordinates, newPoint, elevationData } = action.payload;
      state.points.push(newPoint);
      state.lines.push(coordinates);
      state.totalDistance.push(
        state.totalDistance[state.totalDistance.length - 1] + distance
      );
      state.elevationData.push(elevationData[0]);
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
        state.points[pointIndex] = snappedWaypoints[1];
        state.lines[pointIndex - 1] = line[0];
        state.lines[pointIndex] = line[1];
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

interface DragParams {
  pointIndex: number;
  waypoints: number[][];
  lineIndices: number[];
  totalDistance: number[];
  pointsLength: number;
  setIsDragging: Dispatch<SetStateAction<boolean>>;
  setPoint: Dispatch<SetStateAction<number[]>>;
}

export const updateRouteAfterDrag = ({
  pointIndex,
  waypoints,
  lineIndices,
  pointsLength,
  totalDistance,
  setIsDragging,
  setPoint,
}: DragParams): AppThunk => async dispatch => {
  try {
    const data = await fetchRoutes(waypoints);
    const {
      snapped_waypoints,
      points: { coordinates },
      instructions,
    } = data;

    const lines: number[][][] = createLineSegments(
      coordinates,
      snapped_waypoints
    );

    let startDistance;

    if (pointIndex === 0) {
      startDistance = 0;
    } else if (pointIndex === pointsLength) {
      startDistance = totalDistance[pointIndex - 1];
    } else {
      startDistance = totalDistance[pointIndex - 2];
    }

    const { newElevationSements, currentDistance } = parseElevationData(
      coordinates,
      instructions,
      startDistance
    );

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
  totalDistance,
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
    const { instructions } = data;

    const { newElevationSements } = parseElevationData(
      coordinates,
      instructions,
      totalDistance[totalDistance.length - 1]
    );

    dispatch(
      addRoutingInfo({
        distance: data.distance,
        coordinates,
        newPoint: data.snapped_waypoints.coordinates[1],
        elevationData: newElevationSements,
      })
    );
  } catch (e) {
    console.log(e);
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

const parseElevationData = (
  points: number[][],
  instructions: Instructions[],
  distance: number
): { newElevationSements: ElevationData[][]; currentDistance: number } => {
  let currentDistance = distance;
  let arr = [];
  const newElevationSements = [];

  for (let i = 0; i < instructions.length; i++) {
    if (instructions[i].text === 'Waypoint 1') {
      newElevationSements.push(arr);
      arr = [];
    }
    currentDistance += instructions[i].distance;
    const elevation = points[instructions[i].interval[1]][2];
    arr.push({ distance: currentDistance, elevation });
  }

  newElevationSements.push(arr);
  return { newElevationSements, currentDistance };
};

const createLineSegments = (coordinates, waypoints) => {
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

export default reducer;
