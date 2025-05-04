import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchBatteries, createBattery, updateBattery, deleteBattery } from '../../services/api';

const initialState = {
  batteries: [],
  loading: false,
  error: null,
};

export const loadBatteries = createAsyncThunk('batteries/loadBatteries', async () => {
  const response = await fetchBatteries();
  return response;
});

const batterySlice = createSlice({
  name: 'batteries',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadBatteries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadBatteries.fulfilled, (state, action) => {
        state.loading = false;
        state.batteries = action.payload;
      })
      .addCase(loadBatteries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default batterySlice.reducer;
