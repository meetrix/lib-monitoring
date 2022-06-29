import { TimelineEvent, TrackReport } from '@peermetrics/webrtc-stats';
export { ApiOptions } from '../src/utils/API';
export interface MonitoringConstructorOptions {
  token: string;
  clientId?: string;
  baseUrl?: string;
}

export type EventTypes =
  | 'timeline'
  | 'stats'
  | 'getUserMedia'
  | 'peer'
  | 'track'
  | 'connection'
  | 'datachannel';
export interface Report extends TimelineEvent {
  type: EventTypes;
  conferenceId?: string;
}

export type trackKinds = 'audio' | 'video';
export type audioMimeTypes = 'audio/opus';

export interface TrackReportExtended extends TrackReport {
  audioLevel?: number;
  bitrate?: number;
  bytesReceived?: number;
  clockRate?: number;
  codecId?: string;
  concealedSamples?: number;
  concealmentEvents?: number;
  fecPacketsDiscarded?: number;
  fecPacketsReceived?: number;
  headerBytesReceived?: number;
  insertedSamplesForDeceleration?: number;
  jitter?: number;
  jitterBufferDelay?: number;
  jitterBufferEmittedCount?: number;
  kind?: trackKinds;
  lastPacketReceivedTimestamp?: number;
  mediaType?: trackKinds;
  mimeType?: audioMimeTypes;
  packetRate?: number;
  packetsDiscarded?: number;
  packetsLost?: number;
  packetsReceived?: number;
  payloadType?: number;
  remoteId?: string;
  removedSamplesForAcceleration?: number;
  silentConcealedSamples?: number;
  ssrc?: number;
  totalAudioEnergy?: number;
  totalSamplesDuration?: number;
  totalSamplesReceived?: number;
  trackId?: string;
  transportId?: string;
}

export interface ConnectionReport {
  availableOutgoingBitrate: number;
  bytesDiscardedOnSend: number;
  bytesReceived: number;
  bytesSent: number;
  consentRequestsSent: number;
  currentRoundTripTime: number;
  dataChannelsClosed: number;
  dataChannelsOpened: number;
  id: 'RTCIceCandidatePair_gFnwugUt_czKu+ubr';
  local: any; //FIXME
  localCandidateId: 'RTCIceCandidate_gFnwugUt';
  nominated: true;
  packetsDiscardedOnSend: number;
  packetsReceived: number;
  packetsSent: number;
  priority: number;
  remote: any; //FIXME
  remoteCandidateId: 'RTCIceCandidate_czKu+ubr';
  requestsReceived: number;
  requestsSent: number;
  responsesReceived: number;
  responsesSent: number;
  state: 'succeeded';
  timestamp: number;
  totalRoundTripTime: number;
  transportId: 'RTCTransport_0_1';
  type: 'candidate-pair';
  writable: true;
}

export interface BrowserInfo {
  userAgent: string;
  platform: string;
}

export interface StatsObjectCustom {
  inbound: TrackReportExtended[];
  outbound: TrackReportExtended[];
  connection: ConnectionReport;
}

export interface Peer extends StatsObjectCustom {
  peerId: string;
}
