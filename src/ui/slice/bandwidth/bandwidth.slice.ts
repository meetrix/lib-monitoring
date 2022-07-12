import { createSlice } from '@reduxjs/toolkit';
import deriveOverallStatus from '../../../utils/webrtctests/deriveOverallStatus';

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
  subOrder: ['throughput', 'videoBandwidth'],
  subMessages: {
    throughput: [''],
    videoBandwidth: [''],
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
      const subStatuses = [state.subStatus.throughput, state.subStatus.videoBandwidth];
      state.status = deriveOverallStatus(subStatuses);
    },
    endTest(state, action) {
      console.log('bandwidth', action);

      switch (action.payload[0]) {
        case 'throughput':
          state.subStatus.throughput = action.payload[1];
          break;
        case 'videoBandwidth':
          state.subStatus.videoBandwidth = action.payload[1];
          break;
        default:
          break;
      }
      const subStatuses = [state.subStatus.throughput, state.subStatus.videoBandwidth];
      state.status = deriveOverallStatus(subStatuses);
    },
  },
  extraReducers(builder) {
    builder.addCase('troubleshooter/clear', (state, action) => {
      state.status = '';
      state.subOrder = ['throughput', 'videoBandwidth'];
      state.subMessages = {
        throughput: [''],
        videoBandwidth: [''],
      };
      state.subStatus = {
        throughput: '',
        videoBandwidth: '',
      };
      state.message = '';
    });
  },
});

export const { actions: bandwidthActions } = bandwidthSlice;

export const selectBandwidth = (state: RootState): IBandwidthTestState => state.bandwidth;

export default bandwidthSlice.reducer;
