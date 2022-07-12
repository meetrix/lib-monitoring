import { createSlice } from '@reduxjs/toolkit';

import { RootState } from '../../store/store';
import { ISubMessages, ISubStatus, ITestState } from '../types';

export interface IBrowserSubMessages extends ISubMessages {
  default: string[];
}

export interface IBrowserSubStatus extends ISubStatus {
  default: string;
}

export interface IBrowserTestState extends ITestState {
  status: '' | 'running' | 'success' | 'failure';
  subMessages: IBrowserSubMessages;
  subStatus: IBrowserSubStatus;
  message: string;
}

const initialState: IBrowserTestState = {
  status: '',
  subOrder: ['default'],
  subMessages: {
    default: ['[ INFO ] Test not run yet.'],
  },
  subStatus: {
    default: '',
  },
  message: '',
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
  extraReducers(builder) {
    builder.addCase('troubleshooter/clear', (state, action) => {
      state.status = '';
      state.subOrder = ['default'];
      state.subMessages = {
        default: ['[ INFO ] Test not run yet.'],
      };
      state.subStatus = {
        default: '',
      };
      state.message = '';
    });
  },
});

export const { actions: browserActions } = browserSlice;

export const selectBrowser = (state: RootState): IBrowserTestState => state.browser;

export default browserSlice.reducer;
