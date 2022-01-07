import { StatsObject, TimelineEvent } from '@peermetrics/webrtc-stats'
import { Report } from '@meetrix/webrtc-monitoring-common-lib'
import { StatsObjectCustom } from '../types'
import { addPeerConnected } from '../ui/store/actions'

export const getReportsOfDirection = (
  statsObject: StatsObject,
  direction: 'inbound' | 'outbound'
) => {
  return [...statsObject.audio[direction], ...statsObject.video[direction]]
}
export const getPeerReportData = (statsObject: StatsObject): StatsObjectCustom => {
  return {
    connection: statsObject.connection,
    inbound: getReportsOfDirection(statsObject, 'inbound'),
    outbound: getReportsOfDirection(statsObject, 'outbound')
  }
}

export const getReportFromTimelineEvent = (event: TimelineEvent): Report => {
  return {
    ...event,
    data: getPeerReportData(event.data)
  }
}

export const handleReport = ({ peerId, data }: Report) => {
  addPeerConnected({
    peerId: peerId || 'unknown',
    ...data
  })
}
