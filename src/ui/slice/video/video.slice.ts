import { createSlice } from '@reduxjs/toolkit';

import { RootState } from '../../store/store';
import { ISubMessages, ISubStatus, ITestState } from '../types';

export interface IVideoSubMessages extends ISubMessages {
  p240: string[];
  p480: string[];
  p720: string[];
  generic: string[];
}
export interface IVideoSubStatus extends ISubStatus {
  p240: string;
  p480: string;
  p720: string;
  generic: string;
}

export interface IVideoTestState extends ITestState {
  status: '' | 'running' | 'success' | 'failure';
  subMessages: IVideoSubMessages;
  subStatus: IVideoSubStatus;
  message: string;
}

const initialState: IVideoTestState = {
  status: '',
  subOrder: ['p240', 'p480', 'p720', 'generic'],
  subMessages: {
    p240: ['[ INFO ] Test not run yet.'],
    p480: ['[ INFO ] Test not run yet.'],
    p720: ['[ INFO ] Test not run yet.'],
    generic: ['[ INFO ] Test not run yet.'],
  },
  subStatus: {
    p240: '',
    p480: '',
    p720: '',
    generic: '',
  },
  message: '',
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
    },
  },
  extraReducers(builder) {
    builder.addCase('troubleshooter/clear', (state, action) => {
      state.status = '';
      state.subOrder = ['p240', 'p480', 'p720', 'generic'];
      state.subMessages = {
        p240: ['[ INFO ] Test not run yet.'],
        p480: ['[ INFO ] Test not run yet.'],
        p720: ['[ INFO ] Test not run yet.'],
        generic: ['[ INFO ] Test not run yet.'],
      };
      state.subStatus = {
        p240: '',
        p480: '',
        p720: '',
        generic: '',
      };
      state.message = '';
    });
  },
});

export const { actions: videoActions } = videoSlice;

export const selectVideo = (state: RootState): IVideoTestState => state.video;

export default videoSlice.reducer;
