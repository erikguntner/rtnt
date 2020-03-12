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
  price: {
    min: number | null;
    max: number | null;
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
    price: {
      min: null,
      max: null
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
      if (filter.split('').includes('price')) {
        const [name, type] = filter.split('/');
        state.filters.price[type] = value;
      } else {
        state.filters[filter] = value;
      }
    }
  },
});

export const { addRoutes, updateSortingTerm, updateFilter } = actions;

export default reducer;
