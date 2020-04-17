import { createSlice, PayloadAction } from '@reduxjs/toolkit';
interface Route {
  id: number;
  name: string;
  image: string;
  points: number[][];
  lines: number[][][];
  total_distance: number[];
  created_on: string;
  sports: string[];
  surfaces: string[];
}

interface Filters {
  keyword: string;
  distance: number[];
  sports: string[];
  surfaces: string[];
}

interface State {
  routes: Route[];
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
    distance: [0, 0],
    sports: [],
    surfaces: [],
  }
};

const { actions, reducer } = createSlice({
  name: 'routeList',
  initialState,
  reducers: {
    addRoutes: (state, action: PayloadAction<{ routes: Route[]; maxDistance?: number }>) => {
      state.routes = action.payload.routes;
      if (action.payload.maxDistance) {

        state.maxDistance = action.payload.maxDistance;
        state.filters.distance = [0, action.payload.maxDistance];
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
      if (filter === 'distance') {
        state.filters[filter] = [0, state.maxDistance];
      } else {
        state.filters[filter] = initialState.filters[filter];
      }
    }
  },
});

export const { addRoutes, updateSortingTerm, updateFilter, removeFilter } = actions;

export default reducer;
