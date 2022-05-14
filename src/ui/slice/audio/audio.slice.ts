import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../store/store';

export interface IAudioState {
  status: string;
  subMessages: string[];
  error: string;
}

const initialState: IAudioState = {
  status: '',
  subMessages: ['[ INFO ] Test not run yet.'],
  error: ''
};

export const audioSlice = createSlice({
  name: 'audio',
  initialState,
  reducers: {
    addSubMessage(state, action) {
      state.subMessages.push(action.payload);
    },
    startTest(state, action) {
      state.subMessages = [];
      state.status = 'running';
    },
    endTest(state, action) {
      state.status = action.payload;
    }
  }
});

export const { actions: audioActions } = audioSlice;

export const selectAudio = (state: RootState): IAudioState => state.audio;

export default audioSlice.reducer;
