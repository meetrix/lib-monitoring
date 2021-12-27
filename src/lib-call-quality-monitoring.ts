// Import here Polyfills if needed. Recommended core-js (npm i -D core-js)
// import "core-js/fn/array.find"
// ...
import { WebRTCStats, AddPeerOptions, TimelineEvent } from '@peermetrics/webrtc-stats'
import API from './utils/API'
import { mountUI, updateUI } from './ui'
import { MonitoringConstructorOptions, EventTypes } from './types'
import store from './ui/store'
import { addPeerConnected } from './ui/store/actions'
import { handleReport } from './utils/LocalReport'
export default class Monitor {
  stats: WebRTCStats
  api: API | undefined

  constructor(options: MonitoringConstructorOptions) {
    const { token } = options || {}
    this.api = token ? new API({ token }) : undefined
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
      // 'timeline',
      'stats'
      // 'getUserMedia',
      // 'peer',
      // 'track',
      // 'connection',
      // 'datachannel'
    ]
    events.forEach(eventType => {
      this.stats.on(eventType, (event: TimelineEvent) => {
        console.log(eventType, event)
        if (this.api) {
          this.api.report({ type: eventType, ...event })
        }
        if (eventType === 'stats') {
          handleReport(event)
        }
      })
    })
  }

  addPeer(options: AddPeerOptions) {
    this.stats.addPeer(options)
    // addPeerConnected({ peerId: options.peerId })
  }

  UI() {
    mountUI()
    updateUI()
  }
}
