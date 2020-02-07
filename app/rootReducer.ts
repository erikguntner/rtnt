import { combineReducers } from '@reduxjs/toolkit';
import undoable from 'redux-undo';
import routeReducer, { loadingReducer } from '../features/Map/routeSlice';

const rootReducer = combineReducers({
  route: undoable(routeReducer, {
    limit: 10,
  }),
  loading: loadingReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
