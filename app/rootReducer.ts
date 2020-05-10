import { combineReducers } from '@reduxjs/toolkit';
import undoable, { excludeAction } from 'redux-undo';
import routeReducer, { loadingReducer } from '../features/Map/routeSlice';
import notificationReducer from '../features/Map/notificationSlice';
import authReducer from '../features/Auth/authSlice';
import routeListReducer from '../features/RouteList/routeListSlice';
import { updatePointCoords, changeLoadingState } from '../features/Map/routeSlice';

const rootReducer = combineReducers({
  route: undoable(routeReducer, {
    limit: 10,
    filter: excludeAction([updatePointCoords.type, changeLoadingState.type])
  }),
  routeList: routeListReducer,
  loading: loadingReducer,
  notifications: notificationReducer,
  auth: authReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
