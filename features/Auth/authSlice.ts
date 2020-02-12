import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk } from '../../app/store';

const url =
  process.env.NODE_ENV === 'production'
    ? 'https://run-tracker-next-typescript.now.sh'
    : 'http://localhost:3000';

interface UserI {
  email: string;
  username: string;
}

interface AuthState {
  authenticated: boolean;
  user: UserI;
}

const initialState: AuthState = {
  authenticated: false,
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
      const { authenticated, user } = action.payload;
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

    dispatch(authenticateUser({ authenticated: true, user }));
  } catch (e) {
    console.log(e);
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

    const data = await res.json();
  } catch (e) {}
};

export default reducer;
