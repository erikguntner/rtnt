import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import fetch from 'isomorphic-unfetch';
import { AppThunk } from '../../app/store';

interface RouteState {
  points: number[][];
  lines: number[][];
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

const initialState: RouteState = {
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
      state.lines = state.lines.concat(coordinates);
      state.distance += distance;
      state.elevation = state.elevation.concat(elevation);
    },
  },
});

export const {
  addPoint,
  clearRoute,
  removeLastPoint,
  addRoutingInfo,
} = actions;

export const addRoute = ({
  newPoint,
  newLat,
  newLong,
  startLat,
  startLong,
  transportationType,
  clipPath,
}: RouteParams): AppThunk => async dispatch => {
  let numberOfPoints: number;
  let pointString: string;
  let distance: number;

  try {
    const response = await fetch('http://localhost:3000/api/path', {
      method: 'POST',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        newLat,
        newLong,
        startLat,
        startLong,
        transportationType,
      }),
    });
    const { data } = await response.json();

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
        newPoint,
      })
    );
  } catch (e) {}
};

export default reducer;
