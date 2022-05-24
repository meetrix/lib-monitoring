import { createSlice } from '@reduxjs/toolkit';

import { RootState } from '../../store/store';
import { ISubMessages, ISubStatus, ITestState } from '../types';

export interface INetworkSubMessages extends ISubMessages {
  udp: string[];
  tcp: string[];
  ipv6: string[];
}
export interface INetworkSubStatus extends ISubStatus {
  udp: string;
  tcp: string;
  ipv6: string;
}

export interface INetworkTestState extends ITestState {
  status: '' | 'running' | 'success' | 'failure';
  subMessages: INetworkSubMessages;
  subStatus: INetworkSubStatus;
  error: string;
}

const initialState: INetworkTestState = {
  status: '',
  subMessages: {
    udp: ['[ INFO ] Test not run yet.'],
    tcp: ['[ INFO ] Test not run yet.'],
    ipv6: ['[ INFO ] Test not run yet.'],
  },
  subStatus: {
    udp: '',
    tcp: '',
    ipv6: '',
  },
  error: '',
};

export const networkSlice = createSlice({
  name: 'network',
  initialState,
  reducers: {
    addSubMessage(state, action) {
      switch (action.payload[0]) {
        case 'udp':
          state.subMessages.udp.push(action.payload[1]);
          break;
        case 'tcp':
          state.subMessages.tcp.push(action.payload[1]);
          break;
        case 'ipv6':
          state.subMessages.ipv6.push(action.payload[1]);
          break;

        default:
          break;
      }
    },
    startTest(state, action) {
      switch (action.payload) {
        case 'udp':
          state.subMessages.udp = [];
          state.subStatus.udp = 'running';
          break;
        case 'tcp':
          state.subMessages.tcp = [];
          state.subStatus.tcp = 'running';
          break;
        case 'ipv6':
          state.subMessages.ipv6 = [];
          state.subStatus.ipv6 = 'running';
          break;

        default:
          break;
      }
      state.status = 'running';
    },
    endTest(state, action) {
      switch (action.payload[0]) {
        case 'udp':
          state.subStatus.udp = action.payload[1];
          break;
        case 'tcp':
          state.subStatus.tcp = action.payload[1];
          break;
        case 'ipv6':
          state.subStatus.ipv6 = action.payload[1];
          state.status = 'success';
          break;

        default:
          break;
      }
    },
  },
});

export const { actions: networkActions } = networkSlice;

export const selectNetwork = (state: RootState): INetworkTestState => state.network;

export default networkSlice.reducer;
