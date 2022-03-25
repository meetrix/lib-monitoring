import React, { useState } from 'react';
import { Typography, Chip, Container, Grid, Button } from '@mui/material';
import WebrtcSubTestGrid from './WebrtcSubTestGrid';
import { v4 as uuid } from 'uuid';
import { useAppDispatch } from '../store/hooks';
import { runBandwidthTests, runConnectionTests, runMicTest, runNetworkTests, runVideoTests } from '../../utils/webrtctests';

export type WebrtcTestGridProps = {
  t1: string
}

export const WebrtcTestGrid = ({
  t1
}: WebrtcTestGridProps) => {
  const titles = [
    'Checking your browser',
    'Checking your microphone',
    'Checking your camera',
    'Checking your network connection'
  ];
  const [statusText, setStatusText] = useState('No issues found');

  const dispatch = useAppDispatch();
  const handleStart = async () => {
    await runMicTest(dispatch);
    await runVideoTests(dispatch);
    await runNetworkTests(dispatch);
    await runConnectionTests(dispatch);
    await runBandwidthTests(dispatch);
  };
  
  return (
    <Container maxWidth="xl">
      <Grid container direction="column" alignItems="center">
        <Grid item>
          <Typography>Let's test your devices and network connection</Typography>
        </Grid>
        <Grid item>
          <Typography>Please do not close this window until the test completes</Typography>
        </Grid>

        {titles.map((title) => {
          return (
            <Grid item
              key={uuid()}>
              <WebrtcSubTestGrid
                title={title}
                statusText={statusText}
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

          </Button>
        </Grid>
      </Grid>
    </Container>
  )
}

export default WebrtcTestGrid;
