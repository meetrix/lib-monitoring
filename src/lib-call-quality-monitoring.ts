// Import here Polyfills if needed. Recommended core-js (npm i -D core-js)
  // import "core-js/fn/array.find"
  // ...

import WebrtcStats  from '@peermetrics/webrtc-stats';
import { MonitoringConstructorOptions, AddPeerOptions } from './types';
export default class DummyClass {
  backendUrl: string;
  stats: WebrtcStats

  constructor( { backendUrl }: MonitoringConstructorOptions){
    this.backendUrl = backendUrl;
    this.stats = new WebrtcStats({
      getStatsInterval: 5000
    });
  }

  addPeer (options: AddPeerOptions) {
    this.stats.addPeer(options);
  }
}
