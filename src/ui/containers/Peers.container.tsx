import React, { memo } from 'react';
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
  
  return (
    <div>
      <TestModalContainer open={testModalOpen} onClose={() => setTestModalOpen(false)} />
      <Button onClick={() => setTestModalOpen(true)}>Start</Button>
    </div>
  );
};

export default memo(PeersContainer);
