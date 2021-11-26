// Import here Polyfills if needed. Recommended core-js (npm i -D core-js)
// import "core-js/fn/array.find"
// ...
import { WebRTCStats, AddPeerOptions, TimelineEvent } from '@peermetrics/webrtc-stats'
import API from './utils/API'
import { mountUI, updateUI } from './ui'
import { MonitoringConstructorOptions, EventTypes } from './types'
export default class Monitor {
  stats: WebRTCStats
  api: API | undefined

  constructor(options: MonitoringConstructorOptions) {
    const { backendUrl } = options || {}
    this.api = backendUrl ? new API(backendUrl) : undefined
    this.stats = new WebRTCStats({
      getStatsInterval: 5000,
      rawStats: true,
      statsObject: false,
      filteredStats: false,
      wrapGetUserMedia: true,
      debug: false,
      remote: false,
      logLevel: 'error'
    })
    const events: EventTypes[] = [
      'timeline',
      'stats',
      'getUserMedia',
      'peer',
      'track',
      'connection',
      'datachannel'
    ]
    events.forEach(eventType => {
      this.stats.on(eventType, (event: TimelineEvent) => {
        if (this.api) {
          this.api.report({ type: eventType, ...event })
        }
      })
    })
  }

  addPeer(options: AddPeerOptions) {
    this.stats.addPeer(options)
  }

  UI() {
    mountUI()
    updateUI()
  }
}
