import { TimelineEvent } from '@peermetrics/webrtc-stats'
export interface MonitoringConstructorOptions {
  backendUrl: string
}

export type EventTypes =
  | 'timeline'
  | 'stats'
  | 'getUserMedia'
  | 'peer'
  | 'track'
  | 'connection'
  | 'datachannel'
export interface Report extends TimelineEvent {
  type: EventTypes
  conferenceId?: string
}
