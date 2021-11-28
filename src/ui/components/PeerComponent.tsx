/** @jsx jsx */
import preact from 'preact/compat';
import { jsx } from '@emotion/react';
import { Candidate } from './Candidate';
import { Peer } from '../../types';

export type PeerComponentProps = {
  peer: Peer
}

export const PeerComponent = ({
  peer: { peerId, inbound, outbound, connection }
}: PeerComponentProps) => {
  const getKiliBytesFromBytes = (bytes: number) => bytes >> 10

  return (
    <div
      css={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.2rem'
      }}
    >
      <p>{`peerId: ${peerId}`}</p>
      <p>{`Received (KB): ${getKiliBytesFromBytes(connection.bytesReceived)} Sent (KB): ${getKiliBytesFromBytes(connection.bytesSent)}`}</p>
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
