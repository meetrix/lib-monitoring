// Import here Polyfills if needed. Recommended core-js (npm i -D core-js)
// import "core-js/fn/array.find"
// ...
import { AddPeerOptions, TimelineEvent, WebRTCStats } from '@peermetrics/webrtc-stats'
import { nanoid } from 'nanoid'
import { EventTypes, MonitoringConstructorOptions } from './types'
import { mountUI, updateUI } from './ui'
import API from './utils/API'
import { getReportFromTimelineEvent, handleReport } from './utils/localReport'
import { getClientId, setClientId } from './utils/localStorageUtils'
import { getUrlParams } from './utils/urlUtils'
export default class Monitor {
  stats: WebRTCStats
  api: API | undefined
  clientId: string

  constructor(options: MonitoringConstructorOptions) {
    const { token: _token, clientId: _clientId } = options || {}
    // allow overriding via url parameters
    const { clientId: urlClientId, token: urlToken } = getUrlParams()
    const clientId = urlClientId || _clientId || getClientId()
    const token = urlToken || _token
    if (clientId) {
      this.clientId = clientId
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
        const report = getReportFromTimelineEvent(event)
        // console.log('---- report ----', report);
        if (this.api) {
          this.api.report(report)
        }
        if (eventType === 'stats') {
          handleReport(report)
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
