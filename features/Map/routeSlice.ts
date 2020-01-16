import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import fetch from 'isomorphic-unfetch';
import { AppThunk } from '../../app/store';
import { fetchRoutes } from '../../utils/fetchRoutes';

interface RouteState {
  points: number[][];
  lines: number[][][];
  startPoint: number[];
  endPoint: number[];
  distance: number;
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
  elevation: number[];
  newPoint: number[];
}

interface UpdatedRouteResults {
  pointIndex: number;
  snappedWaypoints: number[][];
  lineIndices: number[];
  line: number[][];
}

export const initialState: RouteState = {
  points: [],
  lines: [],
  startPoint: [],
  endPoint: [],
  distance: 0,
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
      return state;
    },
    removeLastPoint: state => {
      return state;
    },
    addRoutingInfo: (state, action: PayloadAction<RoutingInfo>) => {
      const { distance, coordinates, elevation, newPoint } = action.payload;
      state.points.push(newPoint);
      state.lines.push(coordinates);
      state.distance += distance;
      state.elevation = state.elevation.concat(elevation);
    },
    updateStartAfterDrag: (state, action: PayloadAction<number[]>) => {
      state.points[0] = action.payload;
    },
    updateRouteAfterDragSuccess: {
      reducer: (state, action: PayloadAction<UpdatedRouteResults>) => {
        const {
          pointIndex,
          snappedWaypoints,
          lineIndices,
          line,
        } = action.payload;

        state.points.splice(0, 1, snappedWaypoints[0]);
        state.lines.splice(0, 1, line);
        return state;
      },
      prepare: ({
        pointIndex,
        snappedWaypoints,
        lineIndices,
        line,
      }: UpdatedRouteResults) => {
        return {
          payload: {
            pointIndex,
            snappedWaypoints,
            lineIndices,
            line,
          },
        };
      },
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
  lineIndices: number[]
): AppThunk => async dispatch => {
  const data = await fetchRoutes(waypoints);

  console.log(data);

  const { snapped_waypoints, points } = data;

  // Use snapped_waypoints to identify center point in coordinates, as well as updated location of marker.
  // because the marker may be dragged away from a road where the line should nor render

  let middlePointIndex: number | undefined = undefined;
  if (snapped_waypoints.coordinates.length === 3) {
    middlePointIndex = data.points.coordinates.findIndex(
      coord =>
        coord[0] === snapped_waypoints.coordinates[1][0] &&
        coord[1] === snapped_waypoints.coordinates[1][1]
    );
  }

  const { coordinates, elevation } = data.points.coordinates.reduce(
    (accum, coords) => {
      accum.coordinates.push([coords[0], coords[1]]);
      accum.elevation.push(coords[2]);
      return accum;
    },
    {
      coordinates: [],
      elevation: [],
    }
  );

  dispatch(
    updateRouteAfterDragSuccess({
      pointIndex,
      snappedWaypoints: snapped_waypoints.coordinates,
      lineIndices,
      line: coordinates,
    })
  );

  // first point in data.points.coordinates will be the starting point
  // last point in data.points.coordinates will be the ending point
  // You Need to find the index of the middle snapped waypoint and split the coordinates array into two new arrays
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
    console.log(data);

    const { coordinates, elevation } = data.points.coordinates.reduce(
      (accum, coords) => {
        accum.coordinates.push([coords[0], coords[1]]);
        accum.elevation.push(coords[2]);
        return accum;
      },
      {
        coordinates: [],
        elevation: [],
      }
    );

    dispatch(
      addRoutingInfo({
        distance: data.distance,
        coordinates,
        elevation,
        newPoint: data.snapped_waypoints.coordinates[1],
      })
    );
  } catch (e) {
    console.log(e);
  }
};

export default reducer;
