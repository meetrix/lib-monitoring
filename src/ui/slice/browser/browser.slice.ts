import { createSlice } from '@reduxjs/toolkit';

import { RootState } from '../../store/store';
import { ISubMessages, ISubStatus } from '../types';

export interface IBrowserSubMessages extends ISubMessages {
  default: string[];
}

export interface IBrowserSubStatus extends ISubStatus {
  default: string;
}

export interface IBrowserTestState {
  status: string;
  subMessages: IBrowserSubMessages;
  subStatus: IBrowserSubStatus;
  error: string;
}

const initialState: IBrowserTestState = {
  status: '',
  subMessages: {
    default: ['[ INFO ] Test not run yet.'],
  },
  subStatus: {
    default: '',
  },
  error: '',
};

export const browserSlice = createSlice({
  name: 'browser',
  initialState,
  reducers: {
    addSubMessage(state, action) {
      state.subMessages.default.push(action.payload);
    },
    startTest(state, action) {
      state.subMessages.default = [];
      state.status = 'running';
    },
    endTest(state, action) {
      state.status = action.payload;
    },
  },
});

export const { actions: browserActions } = browserSlice;

export const selectBrowser = (state: RootState): IBrowserTestState => state.browser;

export default browserSlice.reducer;
