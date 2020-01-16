import { combineReducers } from '@reduxjs/toolkit';
import undoable from 'redux-undo';
import routeReducer from '../features/Map/routeSlice';

const rootReducer = combineReducers({
  route: undoable(routeReducer),
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
