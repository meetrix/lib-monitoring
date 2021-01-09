// Import here Polyfills if needed. Recommended core-js (npm i -D core-js)
// import "core-js/fn/array.find"
// ...
import { WebRTCStats, AddPeerOptions, TimelineEvent } from '@peermetrics/webrtc-stats'
import API from './utils/API'
import { MonitoringConstructorOptions } from './types'
export default class Monitor {
  stats: WebRTCStats
  api: API

  constructor({ backendUrl }: MonitoringConstructorOptions) {
    this.api = new API(backendUrl)
    this.stats = new WebRTCStats({
      getStatsInterval: 5000
    })
    this.stats.on('getUserMedia', (event: TimelineEvent) => this.api.report(event))
  }

  addPeer(options: AddPeerOptions) {
    this.stats.addPeer(options)
  }
}
