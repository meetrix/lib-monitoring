import React, { useState } from 'react';
import { Typography, Chip, Container, Grid, Button } from '@mui/material';
import { v4 as uuid } from 'uuid';

import { testBrowser, testCamera, testMicrophone, testNetwork } from '../../utils/webrtctests';
import { TestEvent, TestEventCallback } from '../../utils/webrtctests/TestEvent';

import { useAppDispatch } from '../store/hooks';
import { browserActions, selectBrowser } from '../slice/browser/browser.slice';
import { audioActions, selectAudio } from '../slice/audio/audio.slice';
import { videoActions, selectVideo } from '../slice/video/video.slice';
import { networkActions, selectNetwork } from '../slice/network/network.slice';
import { connectionActions, selectConnection } from '../slice/connection/connection.slice';
import { bandwidthActions, selectBandwidth } from '../slice/bandwidth/bandwidth.slice';
import WebrtcSubTestGrid from './WebrtcSubTestGrid';
import { useSelector } from 'react-redux';

type ActionsType = typeof audioActions | typeof videoActions | typeof networkActions | typeof connectionActions | typeof bandwidthActions;

// TODO Generate proper error messages (human readable), standardize state
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
      status => status === 'success'
    )
  ) {
    overallNetworkStatus = 'success';
  } else if (
    [networkStatus.status, connectionStatus.status, bandwidthStatus.status].some(
      status => status === 'failure'
    )
  ) {
    overallNetworkStatus = 'failure';
  } else if (
    [networkStatus.status, connectionStatus.status, bandwidthStatus.status].some(
      status => status === 'running'
    )
  ) {
    overallNetworkStatus = 'running';
  }

  let overallNetworkError = [networkStatus.error, connectionStatus.error, bandwidthStatus.error].filter(Boolean).join(', ');
  let overallSubMessages = {
    network: networkStatus.subMessages,
    connection: connectionStatus.subMessages,
    bandwidth: bandwidthStatus.subMessages,
  }
  let overallSubStatus = {
    network: networkStatus.subStatus,
    connection: connectionStatus.subStatus,
    bandwidth: bandwidthStatus.subStatus,
  };

  return {
    browser: browserStatus,
    microphone: audioStatus,
    camera: videoStatus,
    network: {
      status: overallNetworkStatus,
      error: overallNetworkError,
      subMessages: overallSubMessages,
      subStatus: overallSubStatus,
    }
  } as { [x: string]: any };
};

const testDetails = [
  { header: 'Checking your browser', name: 'browser' },
  { header: 'Checking your microphone', name: 'microphone' },
  { header: 'Checking your camera', name: 'camera' },
  { header: 'Checking your network connection', name: 'network' },
];

export type WebrtcTestGridProps = {
  t1: string
}

export const WebrtcTestGrid = ({
  t1
}: WebrtcTestGridProps) => {
  const dispatch = useAppDispatch();

  const mapCallbackToDispatch: (actions: ActionsType) => TestEventCallback = (
    actions: ActionsType
  ) => (event, args) => {
    console.log('>>>', event, args);

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
      const [stage, ...rest] = args as unknown as [string, any];
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

  const status = useStatus();
  console.log('>>>', status);

  return (
    <Container maxWidth="xl">
      <Grid container direction="column" alignItems="center">
        <Grid item>
          <Typography>Let's test your devices and network connection</Typography>
        </Grid>
        <Grid item>
          <Typography>Please do not close this window until the test completes</Typography>
        </Grid>

        {testDetails.map((details) => {
          return (
            <Grid item
              key={uuid()}>
              <WebrtcSubTestGrid
                title={details.header}
                statusText={status[details.name].status}
                key={uuid()}
              />
            </Grid>
          )
        })}

        <Grid item>
          <WebrtcSubTestGrid
            title='All test passed'
            statusText=''
          />
        </Grid>

        <Grid item>
          <Button
            onClick={handleStart}>
            Test
          </Button>
        </Grid>
      </Grid>
    </Container>
  )
}

export default WebrtcTestGrid;
