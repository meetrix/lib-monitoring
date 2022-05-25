import { createSlice } from '@reduxjs/toolkit';

import { RootState } from '../../store/store';
import { ISubMessages, ISubStatus, ITestState } from '../types';

export interface IBandwidthSubMessages extends ISubMessages {
  throughput: string[];
  videoBandwidth: string[];
}
export interface IBandwidthSubStatus extends ISubStatus {
  throughput: string;
  videoBandwidth: string;
}

export interface IBandwidthTestState extends ITestState {
  status: '' | 'running' | 'success' | 'failure';
  subMessages: IBandwidthSubMessages;
  subStatus: IBandwidthSubStatus;
  message: string;
}

const initialState: IBandwidthTestState = {
  status: '',
  subOrder: ['throughput', 'bandwidth'],
  subMessages: {
    throughput: ['[ INFO ] Test not run yet.'],
    videoBandwidth: ['[ INFO ] Test not run yet.'],
  },
  subStatus: {
    throughput: '',
    videoBandwidth: '',
  },
  message: '',
};

export const bandwidthSlice = createSlice({
  name: 'bandwidth',
  initialState,
  reducers: {
    addSubMessage(state, action) {
      switch (action.payload[0]) {
        case 'throughput':
          state.subMessages.throughput.push(action.payload[1]);
          break;
        case 'videoBandwidth':
          state.subMessages.videoBandwidth.push(action.payload[1]);
          break;

        default:
          break;
      }
    },
    startTest(state, action) {
      switch (action.payload) {
        case 'throughput':
          state.subMessages.throughput = [];
          state.subStatus.throughput = 'running';
          break;
        case 'videoBandwidth':
          state.subMessages.videoBandwidth = [];
          state.subStatus.videoBandwidth = 'running';
          break;

        default:
          break;
      }
      state.status = 'running';
    },
    endTest(state, action) {
      switch (action.payload[0]) {
        case 'throughput':
          state.subStatus.throughput = action.payload[1];
          break;
        case 'videoBandwidth':
          state.subStatus.videoBandwidth = action.payload[1];
          state.status = 'success';
          break;

        default:
          break;
      }
    },
  },
});

export const { actions: bandwidthActions } = bandwidthSlice;

export const selectBandwidth = (state: RootState): IBandwidthTestState => state.bandwidth;

export default bandwidthSlice.reducer;
