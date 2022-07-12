import { createSlice } from '@reduxjs/toolkit';
import deriveOverallStatus from '../../../utils/webrtctests/deriveOverallStatus';

import { RootState } from '../../store/store';
import { ISubMessages, ISubStatus, ITestState } from '../types';

export interface IConnectionSubMessages extends ISubMessages {
  relay: string[];
  reflexive: string[];
  host: string[];
}
export interface IConnectionSubStatus extends ISubStatus {
  relay: string;
  reflexive: string;
  host: string;
}

export interface IConnectionTestState extends ITestState {
  status: '' | 'running' | 'success' | 'failure';
  subMessages: IConnectionSubMessages;
  subStatus: IConnectionSubStatus;
  message: string;
}

const initialState: IConnectionTestState = {
  status: '',
  subOrder: ['relay', 'reflexive', 'host'],
  subMessages: {
    relay: [],
    reflexive: [],
    host: [],
  },
  subStatus: {
    relay: '',
    reflexive: '',
    host: '',
  },
  message: '',
};

export const connectionSlice = createSlice({
  name: 'connection',
  initialState,
  reducers: {
    addSubMessage(state, action) {
      switch (action.payload[0]) {
        case 'relay':
          state.subMessages.relay.push(action.payload[1]);
          break;
        case 'reflexive':
          state.subMessages.reflexive.push(action.payload[1]);
          break;
        case 'host':
          state.subMessages.host.push(action.payload[1]);
          break;

        default:
          break;
      }
    },
    startTest(state, action) {
      switch (action.payload) {
        case 'relay':
          state.subMessages.relay = [];
          state.subStatus.relay = 'running';
          break;
        case 'reflexive':
          state.subMessages.reflexive = [];
          state.subStatus.reflexive = 'running';
          break;
        case 'host':
          state.subMessages.host = [];
          state.subStatus.host = 'running';
          break;

        default:
          break;
      }
      const subStatuses = [state.subStatus.relay, state.subStatus.reflexive, state.subStatus.host];
      state.status = deriveOverallStatus(subStatuses);
    },
    endTest(state, action) {
      switch (action.payload[0]) {
        case 'relay':
          state.subStatus.relay = action.payload[1];
          break;
        case 'reflexive':
          state.subStatus.reflexive = action.payload[1];
          break;
        case 'host':
          state.subStatus.host = action.payload[1];
          break;

        default:
          break;
      }
      const subStatuses = [state.subStatus.relay, state.subStatus.reflexive, state.subStatus.host];
      state.status = deriveOverallStatus(subStatuses);
    },
  },
});

export const { actions: connectionActions } = connectionSlice;

export const selectConnection = (state: RootState): IConnectionTestState => state.connection;

export default connectionSlice.reducer;
