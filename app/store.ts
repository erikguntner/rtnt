import { configureStore, Action } from '@reduxjs/toolkit';
import { ThunkAction } from 'redux-thunk';

import rootReducer, { RootState } from './rootReducer';

export const initializeStore = (preloadedState = {}) => {
  const storeInit = configureStore({
    reducer: rootReducer,
    preloadedState,
  });

  if (process.env.NODE_ENV === 'development' && module.hot) {
    console.log('it is dev');
    module.hot.accept('./rootReducer', () => {
      console.log('updating root reducer');
      const newRootReducer = require('./rootReducer').default;
      storeInit.replaceReducer(newRootReducer);
    });
  }

  return storeInit;
};

const store = initializeStore();

// if (process.env.NODE_ENV === 'development' && module.hot) {
//   module.hot.accept('./rootReducer', () => {
//     const newRootReducer = require('./rootReducer').default;
//     console.log(newRootReducer);
//     store.replaceReducer(newRootReducer);
//   });
// }

export type AppDispatch = typeof store.dispatch;

export type AppThunk = ThunkAction<void, RootState, null, Action<string>>;

export default store;
