// Import here Polyfills if needed. Recommended core-js (npm i -D core-js)
// import "core-js/fn/array.find"
// ...
import { WebRTCStats, AddPeerOptions, TimelineEvent } from '@peermetrics/webrtc-stats'
import { nanoid } from 'nanoid'
import API from './utils/API'
import { mountUI, updateUI } from './ui'
import { MonitoringConstructorOptions, EventTypes } from './types'
import store from './ui/store'
import { addPeerConnected } from './ui/store/actions'
import { handleReport } from './utils/LocalReport'
import { getClientId, setClientId } from './utils/localStorageUtils'
export default class Monitor {
  stats: WebRTCStats
  api: API | undefined
  clientId: string

  constructor(options: MonitoringConstructorOptions) {
    const { token, clientId } = options || {}
    const _clientId = clientId || getClientId()
    if (_clientId) {
      this.clientId = _clientId
    } else {
      // if there is no client id, use a random value
      const newClientId = nanoid()
      setClientId(newClientId)
      this.clientId = newClientId
    }
    this.api = token ? new API({ token, clientId: this.clientId }) : undefined
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

    getClientId()

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

  addPeer(addPeerOptions: AddPeerOptions) {
    this.stats.addPeer(addPeerOptions)
    // addPeerConnected({ peerId: options.peerId })
  }

  UI() {
    mountUI()
    updateUI()
  }
}
