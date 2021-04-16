import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Route } from './RouteList';
import { AppThunk } from '../../reducers/store';
import API_URL from '../../utils/url';
import { convertLength } from '@turf/helpers';

export interface Filters {
  [index: string]: string | number[] | string[];
  keyword: string;
  range: number[];
  sports: string[];
  surfaces: string[];
}

interface State {
  routes: Route[];
  maxDistance: number;
  sortingTerm: string;
  filters: Filters;
  loading: boolean;
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
  },
  loading: false
};

const { actions, reducer } = createSlice({
  name: 'routeList',
  initialState,
  reducers: {
    addRoutes: (state, action: PayloadAction<{ routes: Route[]; maxDistance?: number }>) => {
      state.routes = action.payload.routes;
      if (action.payload.maxDistance) {

        state.maxDistance = action.payload.maxDistance;
        state.filters.range = [0, action.payload.maxDistance];
      }
    },
    deleteRoute: (state, action: PayloadAction<number>) => {
      state.routes = state.routes.filter((route) => route.id !== action.payload)
    },
    updateSortingTerm: (state, action: PayloadAction<string>) => {
      state.sortingTerm = action.payload;
    },
    updateFilter: (state, action: PayloadAction<{
      filter: string; value: string | number[] | string[];
    }>) => {
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
    },
    changeLoadingState: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    }
  },
});

export const { addRoutes, deleteRoute, updateSortingTerm, updateFilter, removeFilter, clearState, updateMaxDistance, changeLoadingState } = actions;

const calculateMaxDistance = (routes: Route[], units: 'miles' | 'kilometers') => {
  const distance = routes.reduce((accum, curr) => {
    return Math.max(accum, parseInt(curr.distance));
  }, 0);
  return Math.ceil(convertLength(distance, 'meters', units));
};

export const getRoutes = (): AppThunk => async dispatch => {
  dispatch(changeLoadingState(true));
  try {
    const response = await fetch(`${API_URL}/api/routes`, {
      method: 'GET',
      credentials: 'include',
    });

    const { routes, units } = await response.json();

    const maxDistance = calculateMaxDistance(routes, units);
    dispatch(addRoutes({ routes, maxDistance }));

    dispatch(changeLoadingState(false));
  } catch (e) {
    dispatch(changeLoadingState(false));
  }
};

export default reducer;
