// Import here Polyfills if needed. Recommended core-js (npm i -D core-js)
  // import "core-js/fn/array.find"
  // ...

import type { AddPeerOptions, TimelineEvent } from '@peermetrics/webrtc-stats';
import WebrtcStats from '@peermetrics/webrtc-stats';
import axios from 'axios';
import type { MonitoringConstructorOptions } from './types';
export default class DummyClass {
  backendUrl: string;
  stats: WebrtcStats

  constructor( { backendUrl }: MonitoringConstructorOptions){
    this.backendUrl = backendUrl;
    this.stats = new WebrtcStats({
      getStatsInterval: 5000
    });

    const reportToBackend = async (event: TimelineEvent) => {
      try {
        const response = await axios.post(this.backendUrl, event);
      } catch (error) {
        console.error('Meetrix:callQualityMonitor:', error);
      }
    }

    this.stats.on('getUserMedia', event => reportToBackend(event));
  }

  addPeer (options: AddPeerOptions) {
    this.stats.addPeer(options);
  }
}
