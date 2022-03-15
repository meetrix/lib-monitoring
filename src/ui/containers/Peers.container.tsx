import React from 'react';
import { connect } from 'unistore/react';
import { PeersComponent, PeersComponentProps } from '../components/PeersComponent';
import { increment } from '../store/actions';
import mockPeers from '../../data/peers';
import { getUrlParams } from '../../utils/urlUtils';
import { Peer } from '../../types';

export default connect<{}, undefined, undefined, undefined>(
  'peers',
  { increment }
  /* @ts-ignore */
)(({ peers }) => {
  const { mockStats = false } = getUrlParams();
  if (mockStats) {
    return (<PeersComponent peers={mockPeers as Peer[]} />);
  }
  return (<PeersComponent peers={peers} />);
})
