/* eslint-disable */
import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import {
  audioReducer,
  connectionReducer,
  networkReducer,
  videoReducer,
  bandwidthReducer
} from '../slice';

export const store = configureStore({
  reducer: {
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
