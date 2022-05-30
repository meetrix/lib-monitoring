import { createSlice } from '@reduxjs/toolkit';

import { RootState } from '../../store/store';
import { ISubMessages, ISubStatus, ITestState } from '../types';

export interface IAudioSubMessages extends ISubMessages {
  default: string[];
}

export interface IAudioSubStatus extends ISubStatus {
  default: string;
}

export interface IAudioTestState extends ITestState {
  status: '' | 'running' | 'success' | 'failure';
  subMessages: IAudioSubMessages;
  subStatus: IAudioSubStatus;
  message: string;
}

const initialState: IAudioTestState = {
  status: '',
  subOrder: ['default'],
  subMessages: { default: ['[ INFO ] Test not run yet.'] },
  subStatus: { default: '' },
  message: '',
};

export const audioSlice = createSlice({
  name: 'audio',
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
      state.message = action.payload;
    },
  },
});

export const { actions: audioActions } = audioSlice;

export const selectAudio = (state: RootState): IAudioTestState => state.audio;

export default audioSlice.reducer;
