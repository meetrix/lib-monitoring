import { StatsObject, TimelineEvent } from '@peermetrics/webrtc-stats'
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

export const handleReport = ({ peerId, data }: TimelineEvent) => {
  addPeerConnected({
    peerId: peerId || 'unknown',
    ...getPeerReportData(data)
  })
}
