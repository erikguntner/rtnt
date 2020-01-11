import { combineReducers } from '@reduxjs/toolkit';
import undoable from 'redux-undo';

// import issuesDisplayReducer from "features/issuesDisplay/issuesDisplaySlice";
// import repoDetailsReducer from "features/repoSearch/repoDetailsSlice";
// import issuesReducer from "features/issuesList/issuesSlice";
// import commentsReducer from "features/issueDetails/commentsSlice";
import routeReducer from '../features/Map/routeSlice';
// import routeReducer from '../features/Map/routeReducer';

const rootReducer = combineReducers({
  route: undoable(routeReducer),
  // repoDetails: repoDetailsReducer,
  // issues: issuesReducer,
  // comments: commentsReducer
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
