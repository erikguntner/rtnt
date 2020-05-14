import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Viewport {
  latitude: number;
  longitude: number;
  zoom: number;
  bearing: number;
  pitch: number;
}

interface ViewportState {
  initialLoad: boolean;
  viewport: Viewport;
}

const initialState: ViewportState = {
  initialLoad: false,
  viewport: {
    latitude: 42.5,
    longitude: 12.5,
    zoom: 5,
    bearing: 0,
    pitch: 0,
  },
};

const { actions, reducer } = createSlice({
  name: 'viewport',
  initialState,
  reducers: {
    updateViewport: (
      state,
      action: PayloadAction<Viewport>
    ) => {
      if (state.initialLoad === false) {
        state.initialLoad = true;
      }
      state.viewport = action.payload;
    },
  },
});

export const { updateViewport } = actions;

export default reducer;
