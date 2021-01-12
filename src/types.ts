import { TimelineEvent } from '@peermetrics/webrtc-stats'
export interface MonitoringConstructorOptions {
  backendUrl: string
}

export interface Report extends TimelineEvent {
  type: string
}
