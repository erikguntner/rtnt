import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import fetch from 'isomorphic-unfetch';
import { AppThunk } from '../../app/store';
import { setCookieOnLogin } from '../../utils/auth';
import { changeNotificationStatus } from '../Map/notificationSlice';
import API_URL from '../../utils/url';

interface UserI {
  email: string;
  username: string;
  units: 'miles' | 'kilometers';
}

interface AuthState {
  authenticated: string;
  user: UserI;
}

const initialState: AuthState = {
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
    authenticateUser: (state, action: PayloadAction<AuthState>) => {
      const { authenticated, user } = action.payload;
      state.authenticated = authenticated;
      state.user = user;
    },
    changeUsersUnits: (
      state,
      action: PayloadAction<'miles' | 'kilometers'>
    ) => {
      state.user.units = action.payload;
    },
  },
});

export const { authenticateUser, changeUsersUnits } = actions;

interface LoginI {
  username: string;
  password: string;
}

export const login = ({
  username,
  password,
}: LoginI): AppThunk => async dispatch => {
  try {
    const res = await fetch(`${API_URL}/api/login`, {
      method: 'POST',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const { token, user } = await res.json();

    await setCookieOnLogin({ token });
    dispatch(authenticateUser({ authenticated: token, user }));
  } catch (e) {
    console.log('error logging in', e);
  }
};

interface NewUser {
  email: string;
  username: string;
  password: string;
}

export const signup = ({
  email,
  username,
  password,
}: NewUser): AppThunk => async dispatch => {
  try {
    const res = await fetch(`${API_URL}/api/signup`, {
      method: 'POST',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, username, password }),
    });

    const { token, user } = await res.json();

    if (token) {
      await setCookieOnLogin({ token });
      dispatch(authenticateUser({ authenticated: token, user }));
    }
  } catch (e) {
    console.log('error signing up', e);
  }
};

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
        Authorization: JSON.stringify(authenticated),
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
