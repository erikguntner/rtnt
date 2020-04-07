import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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

interface Filters {
  keyword: string;
  distance: {
    min: number;
    max: number;
  };
}

interface State {
  routes: Route[];
  sortingTerm: string;
  filters: Filters;
}

export const initialState: State = {
  routes: [],
  sortingTerm: 'newest',
  filters: {
    keyword: '',
    distance: {
      min: 0,
      max: 0
    },
  }
};

const { actions, reducer } = createSlice({
  name: 'routeList',
  initialState,
  reducers: {
    addRoutes: (state, action: PayloadAction<Route[]>) => {
      state.routes = action.payload;
    },
    updateSortingTerm: (state, action: PayloadAction<string>) => {
      state.sortingTerm = action.payload;
    },
    updateFilter: (state, action: PayloadAction<{ filter: string; value: string | number }>) => {
      const { filter, value } = action.payload;
      if (filter.split('/').includes('distance')) {
        const [name, type] = filter.split('/');
        state.filters.distance[type] = value;
      } else {
        state.filters[filter] = value;
      }
    },
    removeFilter: (state, action: PayloadAction<string>) => {
      const filter = action.payload;
      state.filters[filter] = initialState.filters[filter];
    }
  },
});

export const { addRoutes, updateSortingTerm, updateFilter, removeFilter } = actions;

export default reducer;
