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
  id: number;
  name: string;
  image: string;
  points: number[][];
  lines: number[][][];
  total_distance: number[];
  elevation_data: ElevationData[][];
  created_on: string;
}

interface State {
  routes: Route[];
  filter: string;
}

export const initialState: State = {
  routes: [],
  filter: 'shortest',
};

const { actions, reducer } = createSlice({
  name: 'routeList',
  initialState,
  reducers: {
    addRoutes: (state, action: PayloadAction<Route[]>) => {
      state.routes = action.payload;
    },
    updateFilterTerm: (state, action: PayloadAction<string>) => {
      state.filter = action.payload;
    },
  },
});

export const { addRoutes, updateFilterTerm } = actions;

export default reducer;
