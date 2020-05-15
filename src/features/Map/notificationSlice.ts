import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface NotificationState {
  isVisible: boolean;
  type: string;
  message: string;
}

const initialState: NotificationState = {
  isVisible: false,
  type: '',
  message: '',
};

const { actions, reducer } = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    changeNotificationStatus: (
      state,
      action: PayloadAction<NotificationState>
    ) => {
      const { isVisible, type, message } = action.payload;
      state.isVisible = isVisible;
      state.type = type;
      state.message = message;
    },
    closeNotification: state => {
      state.isVisible = false;
      state.type = '';
      state.message = '';
    },
  },
});

export const { changeNotificationStatus, closeNotification } = actions;

export default reducer;
