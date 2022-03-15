import React from 'react';
import ArrowUpward from '@mui/icons-material/ArrowUpward';
import ArrowDownward from '@mui/icons-material/ArrowDownward';
import { Typography, Chip } from '@mui/material';
import Grid from '@mui/material/Grid';
import { Candidate } from './Candidate';
import { Peer } from '../../types';
import { css } from '@emotion/css';

export type PeerComponentProps = {
  peer: Peer
}

export const PeerComponent = ({
  peer: { peerId, inbound, outbound, connection }
}: PeerComponentProps) => {
  const getKiliBytesFromBytes = (bytes: number) => bytes >> 10

  return (
    <div
      className={
        css({
          display: 'flex',
          flexDirection: 'column',
          gap: '0.2rem'
        })
      }
    >
      <p>{`peerId: ${peerId}`}</p>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <Chip icon={<ArrowUpward/>} label={`${getKiliBytesFromBytes(connection.bytesSent)} KB`}/>
        </Grid>
        <Grid item xs={4}>
          <Chip icon={<ArrowDownward/>} label={`${getKiliBytesFromBytes(connection.bytesReceived)} KB`}/>
        </Grid>
      </Grid>

      <Candidate
        {...connection.local}
      />
      <Candidate
        {...connection.remote}
      />
    </div>
  )
}

export default PeerComponent
