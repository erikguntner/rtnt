import { configureStore, getDefaultMiddleware, Action } from '@reduxjs/toolkit';
import { ThunkAction } from 'redux-thunk';
import createSagaMiddleware from 'redux-saga';

import rootReducer, { RootState } from './rootReducer';
import rootSaga from './sagas';

const sagaMiddleware = createSagaMiddleware();
const middleware = [...getDefaultMiddleware(), sagaMiddleware];

export const initializeStore = (preloadedState = {}) => {
  const storeInit = configureStore({
    reducer: rootReducer,
    middleware,
    preloadedState,
  });

  sagaMiddleware.run(rootSaga);

  return storeInit;
};

export const configStore = configureStore({
  reducer: rootReducer,
});

const store = initializeStore();

export type AppDispatch = typeof store.dispatch;

export type AppThunk = ThunkAction<void, RootState, null, Action<string>>;

export default store;
