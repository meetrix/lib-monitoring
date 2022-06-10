import React, { memo, useEffect } from 'react';
import { Button } from '@mui/material';

import { TestModalContainer } from '../containers/TestModalContainer';

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
  const [testModalOpen, setTestModalOpen] = React.useState(false);

  useEffect(() => {
    setTestModalOpen(true);
  }, []);
  return <TestModalContainer open={testModalOpen} onClose={() => setTestModalOpen(false)} />;
};

export default memo(PeersContainer);
