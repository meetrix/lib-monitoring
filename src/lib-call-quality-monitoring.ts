// Import here Polyfills if needed. Recommended core-js (npm i -D core-js)
  // import "core-js/fn/array.find"
  // ...

import WebrtcStats from '@peermetrics/webrtc-stats';
import { MonitoringConstructorOptions } from './types';
export default class DummyClass {
  backendUrl: string;

  constructor( { backendUrl }: MonitoringConstructorOptions){
    this.backendUrl = backendUrl;
    const webRTCstats = new WebrtcStats({
      getStatsInterval: 5000
  })
  }
}
