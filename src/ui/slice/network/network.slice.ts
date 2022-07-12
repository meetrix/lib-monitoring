import { createSlice } from '@reduxjs/toolkit';
import deriveOverallStatus from '../../../utils/webrtctests/deriveOverallStatus';

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
  message: string;
}

const initialState: INetworkTestState = {
  status: '',
  subOrder: ['udp', 'tcp', 'ipv6'],
  subMessages: {
    udp: ['[ INFO ] Test not run yet.'], // Only the first of the first should show
    tcp: [],
    ipv6: [],
  },
  subStatus: {
    udp: '',
    tcp: '',
    ipv6: '',
  },
  message: '',
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
      const subStatuses = [state.subStatus.udp, state.subStatus.tcp, state.subStatus.ipv6];
      state.status = deriveOverallStatus(subStatuses);
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
          break;

        default:
          break;
      }
      const subStatuses = [state.subStatus.udp, state.subStatus.tcp, state.subStatus.ipv6];
      state.status = deriveOverallStatus(subStatuses);
    },
  },
  extraReducers(builder) {
    builder.addCase('troubleshooter/clear', (state, action) => {
      state.status = '';
      state.subOrder = ['udp', 'tcp', 'ipv6'];
      state.subMessages = {
        udp: ['[ INFO ] Test not run yet.'], // Only the first of the first should show
        tcp: [],
        ipv6: [],
      };
      state.subStatus = {
        udp: '',
        tcp: '',
        ipv6: '',
      };
      state.message = '';
    });
  },
});

export const { actions: networkActions } = networkSlice;

export const selectNetwork = (state: RootState): INetworkTestState => state.network;

export default networkSlice.reducer;
