import React from 'react';
import { Peer } from '../../types';
import { PeerComponent, PeerComponentProps } from './PeerComponent';

export type PeersComponentProps = {
  peers: Peer[]
};

export const PeersComponent = ({ peers }: PeersComponentProps) => {
  if(!(peers && peers.length > 0) ) return (<p>No peers</p>)
  return(<div>
    {
      peers.map(peer => <PeerComponent peer={peer} key={peer.peerId}/>)
    }
  </div>)
}

export default PeersComponent;
