import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchAlerts } from '../../services/api';

const initialState = {
  alerts: [],
  loading: false,
  error: null,
};

export const loadAlerts = createAsyncThunk('alerts/loadAlerts', async () => {
  const response = await fetchAlerts();
  return response;
});

const alertSlice = createSlice({
  name: 'alerts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadAlerts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadAlerts.fulfilled, (state, action) => {
        state.loading = false;
        state.alerts = action.payload;
      })
      .addCase(loadAlerts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default alertSlice.reducer;
