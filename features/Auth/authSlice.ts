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
  validating: boolean;
  authenticated: string;
  user: UserI;
}

const initialState: AuthState = {
  validating: false,
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
    authenticateUser: (state, action: PayloadAction<{ authenticated: string; user: UserI }>) => {
      const { authenticated, user } = action.payload;
      state.authenticated = authenticated;
      state.user = user;
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

interface LoginI {
  username: string;
  password: string;
}

export const login = ({
  username,
  password,
}: LoginI): AppThunk => async dispatch => {
  try {
    const response = await fetch(`${API_URL}/api/login`, {
      method: 'POST',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      const { token, user } = await response.json();

      await setCookieOnLogin({ token });
      dispatch(authenticateUser({ authenticated: token, user }));
    } else {
      console.log('there was an error');
    }
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
    const response = await fetch(`${API_URL}/api/signup`, {
      method: 'POST',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, username, password }),
    });

    if (response.ok) {

      const { token, user } = await response.json();

      if (token) {
        await setCookieOnLogin({ token });
        dispatch(authenticateUser({ authenticated: token, user }));
      }
    } else { }

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
