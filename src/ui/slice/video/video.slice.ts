/* eslint-disable prefer-destructuring */
import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../store/store';

export interface ISubMessages {
  p240: string[];
  p480: string[];
  p720: string[];
  generic: string[];
}
export interface ISubStatus {
  p240: string;
  p480: string;
  p720: string;
  generic: string;
}

export interface IVideoState {
  status: string;
  subMessages: ISubMessages;
  subStatus: ISubStatus;
  error: string;
}

const initialState: IVideoState = {
  status: '',
  subMessages: {
    p240: ['[ INFO ] Test not run yet.'],
    p480: ['[ INFO ] Test not run yet.'],
    p720: ['[ INFO ] Test not run yet.'],
    generic: ['[ INFO ] Test not run yet.']
  },
  subStatus: {
    p240: '',
    p480: '',
    p720: '',
    generic: ''
  },
  error: ''
};

export const videoSlice = createSlice({
  name: 'video',
  initialState,
  reducers: {
    addSubMessage(state, action) {
      switch (action.payload[0]) {
        case 'p240':
          state.subMessages.p240.push(action.payload[1]);
          break;
        case 'p480':
          state.subMessages.p480.push(action.payload[1]);
          break;
        case 'p720':
          state.subMessages.p720.push(action.payload[1]);
          break;
        case 'generic':
          state.subMessages.generic.push(action.payload[1]);
          break;

        default:
          break;
      }
    },
    startTest(state, action) {
      switch (action.payload) {
        case 'p240':
          state.subMessages.p240 = [];
          state.subStatus.p240 = 'running';
          break;
        case 'p480':
          state.subMessages.p480 = [];
          state.subStatus.p480 = 'running';
          break;
        case 'p720':
          state.subMessages.p720 = [];
          state.subStatus.p720 = 'running';
          break;
        case 'generic':
          state.subMessages.generic = [];
          state.subStatus.generic = 'running';
          break;

        default:
          break;
      }
      state.status = 'running';
    },
    endTest(state, action) {
      switch (action.payload[0]) {
        case 'p240':
          state.subStatus.p240 = action.payload[1];
          break;
        case 'p480':
          state.subStatus.p480 = action.payload[1];
          break;
        case 'p720':
          state.subStatus.p720 = action.payload[1];
          break;
        case 'generic':
          state.subStatus.generic = action.payload[1];
          state.status = 'success';
          break;

        default:
          break;
      }
    }
  }
});

export const { actions } = videoSlice;

export const selectVideo = (state: RootState): IVideoState => state.video;

export default videoSlice.reducer;
