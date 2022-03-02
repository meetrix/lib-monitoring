import { StatsObject, TimelineEvent } from '@peermetrics/webrtc-stats'
import { Report, StatsObjectCustom } from '@meetrix/webrtc-monitoring-common-lib'
import { addPeerConnected } from '../ui/store/actions'

export const getReportsOfDirection = (
  statsObject: StatsObject,
  direction: 'inbound' | 'outbound'
) => {
  return [...statsObject.audio[direction], ...statsObject.video[direction]]
}
export const getPeerReportData = async (statsObject: StatsObject): Promise<StatsObjectCustom> => {
  return {
    connection: statsObject.connection,
    inbound: getReportsOfDirection(statsObject, 'inbound'),
    outbound: getReportsOfDirection(statsObject, 'outbound')
  }
}

export const getReportFromTimelineEvent = async (event: TimelineEvent): Promise<Report> => {
  return {
    event: event.event,
    peerId: event.peerId!,
    tag: event.tag,
    timestamp: event.timestamp,
    data: await getPeerReportData(event.data)
  }
}

export const handleReport = ({ peerId, data }: Report) => {
  addPeerConnected({
    peerId: peerId || 'unknown',
    ...data
  })
}
