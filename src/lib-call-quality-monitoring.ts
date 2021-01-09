// Import here Polyfills if needed. Recommended core-js (npm i -D core-js)
  // import "core-js/fn/array.find"
  // ...
import { WebRTCStats, AddPeerOptions } from '@peermetrics/webrtc-stats';
import API from './utils/API';
import type { MonitoringConstructorOptions } from './types';
export default class Monitor {
  stats: WebRTCStats;
  api: API;

  constructor( { backendUrl }: MonitoringConstructorOptions){
    this.api = new API(backendUrl);
    this.stats = new WebRTCStats({
      getStatsInterval: 5000
    });
    this.stats.on('getUserMedia', event => this.api.report(event));
  }

  addPeer (options: AddPeerOptions) {
    this.stats.addPeer(options);
  }
}
