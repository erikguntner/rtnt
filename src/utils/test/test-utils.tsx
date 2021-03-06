import React from 'react';
import { configureStore } from '@reduxjs/toolkit';
import { render, RenderOptions } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { theme } from '../theme';
import rootReducer from '../../reducers/rootReducer';
import { Provider } from 'react-redux';

const customRender = (
  ui: React.ReactElement,
  preloadedState = {},
  options?: Omit<RenderOptions, 'queries'>
) => {
  const WithAllProviders = ({ children }: { children: React.ReactElement }) => {
    const configStore = configureStore({
      reducer: rootReducer,
      preloadedState,
    });

    return (
      <ThemeProvider theme={theme}>
        <Provider store={configStore}>{children}</Provider>
      </ThemeProvider>
    );
  };

  return render(ui, { wrapper: WithAllProviders, ...options });
};

// re-export everything
export * from '@testing-library/react';

// override render method
export { customRender as render };

export const exampleRoute = {
  points: [
    [-117.744039, 34.107202, 361.7],
    [-117.736778, 34.107038, 366.77],
    [-117.720902, 34.106991, 389.76],
  ],
  lines: [
    [
      [-117.744039, 34.107202, 361.7],
      [-117.742611, 34.10719, 361.2],
      [-117.737908, 34.107104, 365.44],
      [-117.737687, 34.107065, 365.59],
      [-117.736778, 34.107051, 366.94],
      [-117.736778, 34.107038, 366.77],
    ],
    [
      [-117.736778, 34.107038, 366.77],
      [-117.736778, 34.107051, 366.94],
      [-117.735545, 34.107029, 369.67],
      [-117.735547, 34.106959, 369.42],
      [-117.732307, 34.10693, 375.5],
      [-117.732277, 34.106947, 375.5],
      [-117.729301, 34.106942, 379.2],
      [-117.729232, 34.106914, 379.17],
      [-117.72905, 34.106914, 379.27],
      [-117.729061, 34.106475, 377.85],
      [-117.727463, 34.106477, 381.53],
      [-117.727113, 34.106546, 381.62],
      [-117.726281, 34.106566, 382.98],
      [-117.725828, 34.106463, 383.09],
      [-117.725447, 34.106233, 383.32],
      [-117.725187, 34.106461, 384.11],
      [-117.725018, 34.106523, 384.09],
      [-117.724822, 34.106566, 384.11],
      [-117.724598, 34.106536, 384.11],
      [-117.723488, 34.106201, 384.74],
      [-117.723217, 34.106172, 384.42],
      [-117.722471, 34.106163, 384.3],
      [-117.722456, 34.106621, 386.14],
      [-117.722054, 34.106625, 386.53],
      [-117.72204, 34.106966, 388.2],
      [-117.721335, 34.106955, 389.28],
      [-117.720902, 34.106991, 389.76],
    ],
  ],
  startPoint: [],
  endPoint: [],
  distance: 2310.9049999999997,
};
