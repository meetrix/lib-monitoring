import React from 'react';
import { useSelector } from 'react-redux';

import getUrlParams from '../../utils/urlUtils';
import TestModal from '../components/TestModal';
import { useAppDispatch } from '../store/hooks';

import { browserActions, selectBrowser } from '../slice/browser/browser.slice';
import { audioActions, selectAudio } from '../slice/audio/audio.slice';
import { videoActions, selectVideo } from '../slice/video/video.slice';
import { networkActions, selectNetwork } from '../slice/network/network.slice';
import { connectionActions, selectConnection } from '../slice/connection/connection.slice';
import { bandwidthActions, selectBandwidth } from '../slice/bandwidth/bandwidth.slice';
import { TestEvent, TestEventCallback } from '../../utils/webrtctests/TestEvent';
import { testBrowser, testCamera, testMicrophone, testNetwork } from '../../utils/webrtctests';

export const sampleData = [
  {
    key: 'browser',
    label: 'Checking your browser',
    status: 'failure',
    message: 'Your browser is not compatible',
    subMessages: {},
    subStatus: {},
  },
  {
    key: 'microphone',
    label: 'Checking your microphone',
    status: 'success',
    message: 'No issues found',
    subMessages: {},
    subStatus: {},
  },
  {
    key: 'camera',
    label: 'Checking your camera',
    status: 'running',
    message: '',
    subMessages: {},
    subStatus: {},
  },
  {
    key: 'network',
    label: 'Checking your network connection',
    status: '',
    message: '',
    subMessages: {},
    subStatus: {},
  },
];

const useStatus = () => {
  const browserStatus = useSelector(selectBrowser);
  const audioStatus = useSelector(selectAudio);
  const videoStatus = useSelector(selectVideo);
  const networkStatus = useSelector(selectNetwork);
  const connectionStatus = useSelector(selectConnection);
  const bandwidthStatus = useSelector(selectBandwidth);

  let overallNetworkStatus = '';
  if (
    [networkStatus.status, connectionStatus.status, bandwidthStatus.status].every(
      status => status === 'success',
    )
  ) {
    overallNetworkStatus = 'success';
  } else if (
    [networkStatus.status, connectionStatus.status, bandwidthStatus.status].some(
      status => status === 'failure',
    )
  ) {
    overallNetworkStatus = 'failure';
  } else if (
    [networkStatus.status, connectionStatus.status, bandwidthStatus.status].some(
      status => status === 'running',
    )
  ) {
    overallNetworkStatus = 'running';
  }

  let overallNetworkError = [networkStatus.error, connectionStatus.error, bandwidthStatus.error]
    .filter(Boolean)
    .join(', ');
  let overallSubMessages = {
    network: networkStatus.subMessages,
    connection: connectionStatus.subMessages,
    bandwidth: bandwidthStatus.subMessages,
  };
  let overallSubStatus = {
    network: networkStatus.subStatus,
    connection: connectionStatus.subStatus,
    bandwidth: bandwidthStatus.subStatus,
  };

  return [
    {
      key: 'browser',
      label: 'Checking your browser',
      status: browserStatus.status,
      message: browserStatus.error,
      subMessages: browserStatus.subMessages,
      subStatus: browserStatus.subStatus,
    },
    {
      key: 'microphone',
      label: 'Checking your microphone',
      status: audioStatus.status,
      message: audioStatus.error,
      subMessages: audioStatus.subMessages,
      subStatus: {},
    },
    {
      key: 'camera',
      label: 'Checking your camera',
      status: videoStatus.status,
      message: videoStatus.error,
      subMessages: videoStatus.subMessages,
      subStatus: videoStatus.subStatus,
    },
    {
      key: 'network',
      label: 'Checking your network connection',
      status: overallNetworkStatus,
      message: overallNetworkError,
      subMessages: overallSubMessages,
      subStatus: overallSubStatus,
    },
  ];
};

export interface ITestModalContainerProps {
  open: boolean;
  onClose: () => void;
}

type ActionsType =
  | typeof audioActions
  | typeof videoActions
  | typeof networkActions
  | typeof connectionActions
  | typeof bandwidthActions;

export const TestModalContainer = ({ open, onClose }: ITestModalContainerProps) => {
  const { mockStats } = getUrlParams();
  const dispatch = useAppDispatch();
  const status = useStatus();

  const mapCallbackToDispatch: (actions: ActionsType) => TestEventCallback = (
    actions: ActionsType,
  ) => (event, args) => {
    switch (event) {
      case TestEvent.START:
        dispatch(actions.startTest(args));
        break;
      case TestEvent.END:
        dispatch(actions.endTest(args));
        break;
      case TestEvent.MESSAGE:
        dispatch(actions.addSubMessage(args));
        break;
    }
  };

  const handleStart = async () => {
    await testBrowser(mapCallbackToDispatch(browserActions));
    await testMicrophone(mapCallbackToDispatch(audioActions));
    await testCamera(mapCallbackToDispatch(videoActions));
    await testNetwork((event, args) => {
      const [stage, ...rest] = (args as unknown) as [string, any];
      switch (stage) {
        case 'network':
          mapCallbackToDispatch(networkActions)(event, rest);
          break;
        case 'connection':
          mapCallbackToDispatch(connectionActions)(event, rest);
          break;
        case 'bandwidth':
          mapCallbackToDispatch(bandwidthActions)(event, rest);
          break;
        default:
          break;
      }
    });
  };

  return (
    <TestModal
      open={open}
      onClose={onClose}
      onRetry={handleStart}
      data={mockStats ? sampleData : status}
    />
  );
};
