import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface NotificationState {
  isVisible: boolean;
  type: string;
}

const initialState: NotificationState = {
  isVisible: true,
  type: 'success',
};

const { actions, reducer } = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    changeNotificationStatus: (state, action: PayloadAction<boolean>) => {},
  },
});

export const { changeNotificationStatus } = actions;

export default reducer;
