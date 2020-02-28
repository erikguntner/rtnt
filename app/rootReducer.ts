import { combineReducers } from '@reduxjs/toolkit';
import undoable from 'redux-undo';
import routeReducer, { loadingReducer } from '../features/Map/routeSlice';
import notificationReducer from '../features/Map/notificationSlice';
import authReducer from '../features/Auth/authSlice';
import routeListReducer from '../features/RouteList/routeListSlice';

const rootReducer = combineReducers({
  route: undoable(routeReducer, {
    limit: 10,
  }),
  routeList: routeListReducer,
  loading: loadingReducer,
  notifications: notificationReducer,
  auth: authReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
