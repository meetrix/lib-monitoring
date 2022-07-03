import React, { useEffect, useState } from 'react';
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
import { submitTroubleshooterSession } from '../slice/troubleshooter/troubleshooter.slice';
import { TestEvent, TestEventCallback } from '../../utils/webrtctests/TestEvent';
import { testBrowser, testCamera, testMicrophone, testNetwork } from '../../utils/webrtctests';
import { generateFakeStateList } from '../../utils/webrtctests/fakeStateGenerator';
import { components, ITestView, statuses, subComponents } from '../slice/types';
import deriveOverallStatus from '../../utils/webrtctests/deriveOverallStatus';
import SetupModal from '../components/SetupModal';

const useStatus = () => {
  const browserStatus = useSelector(selectBrowser);
  const audioStatus = useSelector(selectAudio);
  const videoStatus = useSelector(selectVideo);
  const networkStatus = useSelector(selectNetwork);
  const connectionStatus = useSelector(selectConnection);
  const bandwidthStatus = useSelector(selectBandwidth);

  const subNetworkStatuses = [
    networkStatus.status,
    connectionStatus.status,
    bandwidthStatus.status,
  ];
  const overallNetworkStatus = deriveOverallStatus(subNetworkStatuses);

  const overallNetworkError = [
    networkStatus.message,
    connectionStatus.message,
    bandwidthStatus.message,
  ]
    .filter(Boolean)
    .join(', ');

  const overallSubMessages = {
    'network-udp': networkStatus.subMessages.udp,
    'network-tcp': networkStatus.subMessages.tcp,
    'network-ipv6': networkStatus.subMessages.ipv6,
    'connection-host': connectionStatus.subMessages.host,
    'connection-reflexive': connectionStatus.subMessages.reflexive,
    'connection-relay': connectionStatus.subMessages.relay,
    'bandwidth-throughput': bandwidthStatus.subMessages.throughput,
    'bandwidth-videoBandwidth': bandwidthStatus.subMessages.videoBandwidth,
  };
  const overallSubStatus = {
    'network-udp': networkStatus.subStatus.udp,
    'network-tcp': networkStatus.subStatus.tcp,
    'network-ipv6': networkStatus.subStatus.ipv6,
    'connection-host': connectionStatus.subStatus.host,
    'connection-reflexive': connectionStatus.subStatus.reflexive,
    'connection-relay': connectionStatus.subStatus.relay,
    'bandwidth-throughput': bandwidthStatus.subStatus.throughput,
    'bandwidth-videoBandwidth': bandwidthStatus.subStatus.videoBandwidth,
  };

  return [
    {
      key: components[0],
      label: 'Checking your browser',
      ...browserStatus,
    },
    {
      key: components[1],
      label: 'Checking your microphone',
      ...audioStatus,
    },
    {
      key: components[2],
      label: 'Checking your camera',
      ...videoStatus,
    },
    {
      key: components[3],
      subOrder: [...subComponents[components[3]]],
      label: 'Checking your network connection',
      status: overallNetworkStatus,
      message: overallNetworkError,
      subMessages: overallSubMessages,
      subStatus: overallSubStatus,
    },
  ] as ITestView[];
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
  const {
    mockStats,
    troubleshooterMock,
    troubleshooterOnly,
    email: autofillEmail,
  } = getUrlParams();
  const dispatch = useAppDispatch();
  const status = useStatus();
  const [email, setEmail] = useState('');
  const [emailEntered, setEmailEntered] = useState(false);

  useEffect(() => {
    setEmail(autofillEmail || '');
  }, [autofillEmail]);

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

  const shouldRunTest = (test: string) => {
    return !troubleshooterOnly || troubleshooterOnly.includes(test);
  };

  const handleStart = async () => {
    setEmailEntered(true);

    const browserResult = shouldRunTest('browser')
      ? await testBrowser(mapCallbackToDispatch(browserActions))
      : true;
    const microphoneResult = shouldRunTest('audio')
      ? await testMicrophone(mapCallbackToDispatch(audioActions))
      : true;
    const cameraResult = shouldRunTest('video')
      ? await testCamera(mapCallbackToDispatch(videoActions))
      : true;
    const networkResult = shouldRunTest('network')
      ? await testNetwork((event, args) => {
          const [stage, rest] = (args as unknown) as [string, any];

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
        })
      : true;

    const testStatus = {
      browser: { status: browserResult },
      microphone: { status: microphoneResult },
      camera: { status: cameraResult },
      network: { status: networkResult },

      overall: { status: browserResult && microphoneResult && cameraResult && networkResult },
    };

    dispatch(submitTroubleshooterSession({ email, tests: testStatus }));
  };

  // Accepts state of the last running component; all previous ones set to pass
  // e.g.: http://localhost:8080/?mockStats=true&troubleshooterMock=component=camera,status=running
  const componentArg = ((components.includes(troubleshooterMock?.component as any) &&
    troubleshooterMock?.component) ||
    'network') as typeof components[number];
  const statusArg = ((statuses.includes(troubleshooterMock?.status as any) &&
    troubleshooterMock?.status) ||
    'failure') as typeof statuses[number];
  const subComponentArg = (([...subComponents[componentArg]].includes(
    troubleshooterMock?.subComponent as any,
  ) &&
    troubleshooterMock?.subComponent) ||
    'connection-reflexive') as typeof subComponents[typeof components[number]][number];
  const sampleData = generateFakeStateList({
    component: componentArg,
    status: statusArg,
    subComponent: subComponentArg,
  });

  return (
    <>
      <SetupModal
        open={!emailEntered}
        email={email}
        onEmailChange={setEmail}
        onStart={handleStart}
        startLabel="START TEST"
      />
      <TestModal
        open={open && emailEntered}
        onClose={onClose}
        onRetry={mockStats ? () => {} : handleStart}
        data={mockStats ? sampleData : status}
      />
    </>
  );
};
