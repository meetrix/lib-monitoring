import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import API from '../../../utils/API';
import { getAgentData } from '../../../utils/webrtctests/agentData/agentData';
import { RootState } from '../../store/store';

export interface ITroubleshooterState {
  status: '' | 'running' | 'success' | 'failure';
  error: string | null;
  data: any;
}

const initialState: ITroubleshooterState = {
  status: '',
  error: null,
  data: null,
};

export const troubleshooterSlice = createSlice({
  name: 'troubleshooter',
  initialState,
  reducers: {
    submitResponse(state, action) {},
  },
  extraReducers(builder) {
    builder.addCase(submitTroubleshooterSession.pending, (state, action) => {
      state.status = 'running';
    });
    builder.addCase(submitTroubleshooterSession.fulfilled, (state, action) => {
      state.status = 'success';
      state.data = action.payload;
    });
    builder.addCase(submitTroubleshooterSession.rejected, (state, action) => {
      state.status = 'failure';
      state.error = action.error?.message || null;
    });
  },
});

export const submitTroubleshooterSession = createAsyncThunk(
  'troubleshooter',
  async ({ email, tests }: { email: string; tests: any }) => {
    const agentData = await getAgentData();
    const response = await API.default?.rest?.post('/troubleshooter', {
      metadata: agentData,
      email,
      tests,
    });
    return response?.data;
  },
);

export const { actions: troubleshooterActions } = troubleshooterSlice;

export const selectTroubleshooter = (state: RootState): ITroubleshooterState =>
  state.troubleshooter;

export default troubleshooterSlice.reducer;
