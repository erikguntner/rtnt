export const ADD_ROUTE = 'ADD_RUOTE';
export const ADD_POINT = 'ADD_POINT';
export const CLEAR_ROUTE = 'CLEAR_ROUTE';
export const ADD_ROUTING_INFO = 'ADD_ROUTING_INFO';
export const REMOVE_LAST_POINT = 'REMOVE_LAST_POINT';
export const UNDO = 'UNDO';
import { AppThunk } from '../../app/store';

interface AddPointAction {
  type: typeof ADD_POINT;
  payload: number[];
}

interface AddRouteAction {
  type: typeof ADD_ROUTE;
  payload: RouteParams;
}

interface ClearRouteAction {
  type: typeof CLEAR_ROUTE;
}

interface RoutingInfo {
  distance: number;
  coordinates: number[][];
  elevation: number[];
  newPoint: number[];
}

interface AddRoutingInfoAction {
  type: typeof ADD_ROUTING_INFO;
  payload: RoutingInfo;
}

interface RemoveLastPointAction {
  type: typeof REMOVE_LAST_POINT;
}

interface UndoAction {
  type: typeof UNDO;
}

type RouteActionTypes =
  | AddRouteAction
  | ClearRouteAction
  | RemoveLastPointAction
  | AddPointAction
  | AddRoutingInfoAction
  | UndoAction;

interface RouteParams {
  newPoint: number[];
  newLat: number;
  newLong: number;
  startLat: number;
  startLong: number;
  transportationType?: string;
  clipPath: boolean;
}

interface RouteState {
  points: number[][];
  lines: number[][];
  startPoint: number[];
  endPoint: number[];
  distance: number;
  elevation: number[];
}

const initialState: RouteState = {
  points: [],
  lines: [],
  startPoint: [],
  endPoint: [],
  distance: 0,
  elevation: [],
};

const routeReducer = (state = initialState, action: RouteActionTypes) => {
  switch (action.type) {
    case ADD_POINT:
      return {
        ...state,
        points: [...state.points, action.payload],
      };
    case CLEAR_ROUTE:
      return state;
    case REMOVE_LAST_POINT:
      return state;
    case ADD_ROUTING_INFO:
      const { distance, coordinates, elevation, newPoint } = action.payload;
      return {
        ...state,
        points: [...state.points, newPoint],
        lines: [...state.lines, ...coordinates],
        distance: state.distance + distance,
        elevation: [...state.elevation, ...elevation],
      };
    default:
      return state;
  }
};

export const addPoint = (newPoint: number[]): RouteActionTypes => ({
  type: ADD_POINT,
  payload: newPoint,
});

export const addRoutingInfo = ({
  distance,
  coordinates,
  elevation,
  newPoint,
}: RoutingInfo): RouteActionTypes => ({
  type: ADD_ROUTING_INFO,
  payload: { distance, coordinates, elevation, newPoint },
});

export const clearRoute = (): RouteActionTypes => ({
  type: CLEAR_ROUTE,
});

export const removeLastPoint = (): RouteActionTypes => ({
  type: REMOVE_LAST_POINT,
});

export const undo = (): RouteActionTypes => ({
  type: UNDO,
});

export const addRoute = ({
  newPoint,
  newLat,
  newLong,
  startLat,
  startLong,
  transportationType,
  clipPath,
}: RouteParams): AppThunk => async dispatch => {
  let numberOfPoints: number;
  let pointString: string;
  let distance: number;

  try {
    const response = await fetch('http://localhost:3000/api/path', {
      method: 'POST',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        newLat,
        newLong,
        startLat,
        startLong,
        transportationType,
      }),
    });

    const { data } = await response.json();

    const { coordinates, elevation } = data.points.coordinates.reduce(
      (accum, coords) => {
        accum.coordinates.push([coords[0], coords[1]]);
        accum.elevation.push(coords[2]);
        return accum;
      },
      {
        coordinates: [],
        elevation: [],
      }
    );

    dispatch(
      addRoutingInfo({
        distance: data.distance,
        coordinates,
        elevation,
        newPoint,
      })
    );
  } catch (e) {}
};

export default routeReducer;
// export default routeReducer;
