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
      getStatsInterval: 5000,
      rawStats: true
    })
    const events = [
      'timeline',
      'stats',
      'getUserMedia',
      'peer',
      'track',
      'connection',
      'datachannel'
    ]
    events.forEach(eventType => {
      this.stats.on(eventType, (event: TimelineEvent) =>
        this.api.report({ type: eventType, ...event })
      )
    })
  }

  addPeer(options: AddPeerOptions) {
    this.stats.addPeer(options)
  }
}
