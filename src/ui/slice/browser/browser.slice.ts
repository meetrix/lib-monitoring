/* eslint-disable prefer-destructuring */
import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../store/store';

export interface ISubMessages {}
export interface ISubStatus {}

export interface IBrowserState {
  status: string;
  subMessages: ISubMessages;
  subStatus: ISubStatus;
  error: string;
}

const initialState: IBrowserState = {
  status: '',
  subMessages: ['[ INFO ] Test not run yet.'],
  subStatus: {},
  error: ''
};

export const browserSlice = createSlice({
  name: 'browser',
  initialState,
  reducers: {
    addSubMessage(state, action) {},
    startTest(state, action) {
      state.subMessages = [];
      state.status = 'running';
    },
    endTest(state, action) {
      state.status = action.payload;
    }
  }
});

export const { actions: browserActions } = browserSlice;

export const selectBrowser = (state: RootState): IBrowserState => state.browser;

export default browserSlice.reducer;
