import React, { memo } from 'react';
import { getUrlParams } from '../../utils/urlUtils';
import WebrtcTestGrid from '../components/WebrtcTestGrid';

//  connect<{}, undefined, undefined, undefined>(
//   'peers',
//   { increment }
//   /* @ts-ignore */
// )(({ peers }) => {
//   const { mockStats = false } = getUrlParams();
//   // if (mockStats) {
//   //   return (<PeersComponent peers={mockPeers as Peer[]} />);
//   // }
//   // return (<PeersComponent peers={peers} />);

//   return <WebrtcTestGrid t1='hello'></WebrtcTestGrid>;
// })


interface IPeers {}

const PeersContainer: React.FC<IPeers> = ({}: IPeers) => {
  return <WebrtcTestGrid t1='hello'></WebrtcTestGrid>;
};

export default memo(PeersContainer);