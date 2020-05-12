import { configureStore, getDefaultMiddleware, Action } from '@reduxjs/toolkit';
import { ThunkAction } from 'redux-thunk';

import rootReducer, { RootState } from './rootReducer';


export const initializeStore = (preloadedState = {}) => {
  const middleware = [...getDefaultMiddleware()];

  const store = configureStore({
    reducer: rootReducer,
    middleware,
    preloadedState,
  });


  if (process.env.NODE_ENV !== 'production' && module.hot) {
    module.hot.accept('./rootReducer', () => store.replaceReducer(rootReducer))
  }

  return store;
};

export const configStore = configureStore({
  reducer: rootReducer,
});

const store = initializeStore();

export type AppDispatch = typeof store.dispatch;

export type AppThunk = ThunkAction<void, RootState, null, Action<string>>;

export default store;
