import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import fetch from 'isomorphic-unfetch';
import { AppThunk } from '../../reducers/store';
import { removeCookieOnSignout } from '../../utils/auth';
import { changeNotificationStatus } from '../Map/notificationSlice';
import { clearState } from '../RouteList/routeListSlice';
import API_URL from '../../utils/url';

interface User {
  email: string;
  username: string;
  units: 'miles' | 'kilometers';
}

interface AuthState {
  validating: boolean;
  authenticated: string;
  user: User;
}

const initialState: AuthState = {
  validating: true,
  authenticated: '',
  user: {
    email: '',
    username: '',
    units: 'miles',
  },
};

const { actions, reducer } = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    authenticateUser: (state, action: PayloadAction<{ authenticated: string; user: User }>) => {
      const { authenticated, user } = action.payload;
      state.authenticated = authenticated;
      state.user = user;
      state.validating = false;
    },
    setValidating: (state, action: PayloadAction<boolean>) => {
      state.validating = action.payload
    },
    changeUsersUnits: (
      state,
      action: PayloadAction<'miles' | 'kilometers'>
    ) => {
      state.user.units = action.payload;
    },
  },
});

export const { authenticateUser, changeUsersUnits, setValidating } = actions;

interface NewUser {
  email: string;
  username: string;
  password: string;
}

export const signout = ({ units }): AppThunk => async dispatch => {
  removeCookieOnSignout();
  dispatch(authenticateUser({
    authenticated: '',
    user: {
      username: '', email: '', units,
    }
  }))
  dispatch(clearState());
}

export const updateUnits = (
  units: 'miles' | 'kilometers',
  authenticated: string
): AppThunk => async dispatch => {
  if (!authenticated) {
    dispatch(changeUsersUnits(units));
    return;
  }

  try {
    const response = await fetch(`${API_URL}/api/units`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ units }),
    });

    if (response.ok) {
      dispatch(changeUsersUnits(units));
    } else {
      changeNotificationStatus({
        isVisible: true,
        type: 'error',
        message: 'Looks like there was an error on our end. Please try again.',
      });
    }
  } catch (err) {
    console.log(err);
    changeNotificationStatus({
      isVisible: true,
      type: 'error',
      message: 'Looks like there was an error on our end. Please try again.',
    });
  }
};

export default reducer;
