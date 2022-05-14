/* eslint-disable import/named */

import runBandwidthTests from './bandwidth/bandwidth';
import runConnectionTests from './connection/connection';
import runNetworkTests from './network/network';

import { TestEventCallback as TEC } from './TestEvent';

// Wrapped API

export { default as testBrowser } from './browser/browser';
export { default as testMicrophone } from './audio/audio';
export { default as testCamera } from './video/video';

// Temporary facade to unify the network APIs
export async function testNetwork(callback: TestEventCallback): Promise<boolean> {
  const networkStatus = await runNetworkTests((event, ...args: any) =>
    callback(event, ['network', ...args])
  );
  const connectionStatus = await runConnectionTests((event, ...args: any) =>
    callback(event, ['connection', ...args])
  );
  const bandwidthStatus = await runBandwidthTests((event, ...args: any) =>
    callback(event, ['bandwidth', ...args])
  );

  return networkStatus && connectionStatus && bandwidthStatus;
}

export type TestEventCallback = TEC;
