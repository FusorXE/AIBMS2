import { configureStore } from '@reduxjs/toolkit';
import batteryReducer from './slices/batterySlice';
import alertReducer from './slices/alertSlice';
import userReducer from './slices/userSlice';

export const store = configureStore({
  reducer: {
    batteries: batteryReducer,
    alerts: alertReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
