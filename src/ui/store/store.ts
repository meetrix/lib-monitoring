/* eslint-disable */
import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import {
  browserReducer,
  audioReducer,
  connectionReducer,
  networkReducer,
  videoReducer,
  bandwidthReducer
} from '../slice';

export const store = configureStore({
  reducer: {
    browser: browserReducer,
    audio: audioReducer,
    video: videoReducer,
    network: networkReducer,
    connection: connectionReducer,
    bandwidth: bandwidthReducer
  }
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
