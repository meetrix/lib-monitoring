/* eslint-disable prefer-destructuring */
import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../store/store';

export interface ISubMessages {
  relay: string[];
  reflexive: string[];
  host: string[];
}
export interface ISubStatus {
  relay: string;
  reflexive: string;
  host: string;
}

export interface IConnectionState {
  status: string;
  subMessages: ISubMessages;
  subStatus: ISubStatus;
  error: string;
}

const initialState: IConnectionState = {
  status: '',
  subMessages: {
    relay: ['[ INFO ] Test not run yet.'],
    reflexive: ['[ INFO ] Test not run yet.'],
    host: ['[ INFO ] Test not run yet.']
  },
  subStatus: {
    relay: '',
    reflexive: '',
    host: ''
  },
  error: ''
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
      state.status = 'running';
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
          state.status = 'success';
          break;

        default:
          break;
      }
    }
  }
});

export const { actions: connectionActions } = connectionSlice;

export const selectConnection = (state: RootState): IConnectionState => state.connection;

export default connectionSlice.reducer;
