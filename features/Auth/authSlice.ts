import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk } from '../../app/store';
import fetch from 'isomorphic-unfetch';
import { setCookieOnLogin } from '../../utils/auth';

const url =
  process.env.NODE_ENV === 'production'
    ? 'https://rtnt.now.sh'
    : 'http://localhost:3000';

interface UserI {
  email: string;
  username: string;
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
  },
};

const { actions, reducer } = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    authenticateUser: (state, action: PayloadAction<AuthState>) => {
      const {
        authenticated,
        user: { username },
      } = action.payload;
      state.authenticated = authenticated;
      state.user = { username, email: 'me@gmail.com' };
    },
  },
});

export const { authenticateUser } = actions;

interface LoginI {
  username: string;
  password: string;
}

export const login = ({
  username,
  password,
}: LoginI): AppThunk => async dispatch => {
  try {
    const res = await fetch(`${url}/api/login`, {
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
    const res = await fetch(`${url}/api/signup`, {
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

export default reducer;
