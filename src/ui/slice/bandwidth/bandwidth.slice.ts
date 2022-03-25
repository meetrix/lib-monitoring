/* eslint-disable prefer-destructuring */
import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../store/store';

export interface ISubMessages {
  throughput: string[];
  videoBandwidth: string[];
}
export interface ISubStatus {
  throughput: string;
  videoBandwidth: string;
}

export interface IBandwidthState {
  status: string;
  subMessages: ISubMessages;
  subStatus: ISubStatus;
  error: string;
}

const initialState: IBandwidthState = {
  status: '',
  subMessages: {
    throughput: ['[ INFO ] Test not run yet.'],
    videoBandwidth: ['[ INFO ] Test not run yet.']
  },
  subStatus: {
    throughput: '',
    videoBandwidth: ''
  },
  error: ''
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
    }
  }
});

export const { actions } = bandwidthSlice;

export const selectBandwidth = (state: RootState): IBandwidthState => state.bandwidth;

export default bandwidthSlice.reducer;
