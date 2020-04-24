import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RouteI } from './RouteList';

interface Filters {
  keyword: string;
  range: number[];
  sports: string[];
  surfaces: string[];
}

interface State {
  routes: RouteI[];
  maxDistance: number;
  sortingTerm: string;
  filters: Filters;
}

export const initialState: State = {
  routes: [],
  maxDistance: 0,
  sortingTerm: 'newest',
  filters: {
    keyword: '',
    range: [0, 0],
    sports: [],
    surfaces: [],
  }
};

const { actions, reducer } = createSlice({
  name: 'routeList',
  initialState,
  reducers: {
    addRoutes: (state, action: PayloadAction<{ routes: RouteI[]; maxDistance?: number }>) => {
      state.routes = action.payload.routes;
      if (action.payload.maxDistance) {

        state.maxDistance = action.payload.maxDistance;
        state.filters.range = [0, action.payload.maxDistance];
      }
    },
    updateSortingTerm: (state, action: PayloadAction<string>) => {
      state.sortingTerm = action.payload;
    },
    updateFilter: (state, action: PayloadAction<{ filter: string; value: string | number[] | string[] }>) => {
      const { filter, value } = action.payload;
      state.filters[filter] = value;
    },
    removeFilter: (state, action: PayloadAction<string>) => {
      const filter = action.payload;
      if (filter === 'range') {
        state.filters[filter] = [0, state.maxDistance];
      } else {
        state.filters[filter] = initialState.filters[filter];
      }
    },
    updateMaxDistance: (state, action: PayloadAction<number>) => {
      state.maxDistance = action.payload;
      state.filters.range = [0, action.payload];
    },
    clearState: (state) => {
      state = initialState;
    }
  },
});

export const { addRoutes, updateSortingTerm, updateFilter, removeFilter, clearState, updateMaxDistance } = actions;

export default reducer;
