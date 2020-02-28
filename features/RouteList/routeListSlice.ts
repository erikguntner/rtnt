import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Dispatch, SetStateAction } from 'react';
import { AppThunk } from '../../app/store';
import fetch from 'isomorphic-unfetch';

interface ElevationData {
  distance: number;
  segDistance: number;
  elevation: number;
}
interface Route {
  name: string;
  image: string;
  points: number[][];
  lines: number[][][];
  totalDistance: number[];
  elevationData: ElevationData[][];
}

interface State {
  routes: Route[];
}

export const initialState: State = {
  routes: [],
};

const { actions, reducer } = createSlice({
  name: 'routeList',
  initialState,
  reducers: {
    addRoutes: (state, action: PayloadAction<Route[]>) => {
      state.routes = action.payload;
    },
  },
});

export const { addRoutes } = actions;

export default reducer;
