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
export const getPeerReportData = async (statsObject: StatsObject): Promise<StatsObjectCustom> => {
  const browserInfo = { userAgent: navigator.userAgent, platform: navigator.platform }
  const mediaDeviceInfo = await navigator.mediaDevices.enumerateDevices()
  return {
    connection: statsObject.connection,
    inbound: getReportsOfDirection(statsObject, 'inbound'),
    outbound: getReportsOfDirection(statsObject, 'outbound'),
    browserInfo,
    mediaDeviceInfo
  }
}

export const getReportFromTimelineEvent = async (event: TimelineEvent): Promise<Report> => {
  return {
    ...event,
    data: await getPeerReportData(event.data)
  }
}

export const handleReport = ({ peerId, data }: Report) => {
  addPeerConnected({
    peerId: peerId || 'unknown',
    ...data
  })
}
