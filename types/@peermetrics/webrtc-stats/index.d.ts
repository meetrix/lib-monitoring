/// <reference types="node" />
import { EventEmitter } from 'events';

export interface WebRTCStatsConstructorOptions {
  getStatsInterval: number
  wrapRTCPeerConnection: boolean
  rawStats: boolean
  statsObject: boolean
  filteredStats: boolean
  compressStats: boolean
  wrapGetUserMedia: boolean
  wrapLegacyGetUserMedia: boolean
  prefixesToWrap: string[]
  debug: boolean
}

export type TimelineTag = 'getUserMedia' | 'peer' | 'connection' | 'track' | 'datachannel' | 'stats'

export interface TimelineEvent {
  event: string
  tag: TimelineTag
  timestamp?: Date
  data?: any
  peerId?: string
  error?: any
  rawStats?: RTCStatsReport
  statsObject?: any
  filteredStats?: any

}

export interface AddPeerOptions {
  pc: RTCPeerConnection
  peerId: string
}

export interface GetUserMediaResponse {
  constraints?: MediaStreamConstraints
  stream?: MediaStream
  error?: DOMError
}

export interface MonitoredPeer {
  pc: RTCPeerConnection
  stream: MediaStream | null
  stats: any
}

export interface MonitoredPeersObject {
  [index: string]: MonitoredPeer
}

interface StatsObjectDetails {
  local: any
  remote: any
}
export interface StatsObject {
  audio: StatsObjectDetails
  video: StatsObjectDetails
  connection: any
}

export interface CodecInfo {
  clockRate: number
  mimeType: number
  payloadType: number
}

export declare class WebRTCStats extends EventEmitter {
    private isEdge;
    private getStatsInterval;
    private monitoringSetInterval;
    private rawStats;
    private statsObject;
    private filteredStats;
    private shouldWrapGetUserMedia;
    private debug;
    private peersToMonitor;
    /**
     * Used to keep track of all the events
     */
    private timeline;
    /**
     * A list of stats to look after
     */
    private statsToMonitor;
    constructor(constructorOptions: WebRTCStatsConstructorOptions);
    /**
     * Start tracking a RTCPeerConnection
     * @param {Object} options The options object
     */
    addPeer(options: AddPeerOptions): Promise<void>;
    /**
     * Returns the timeline of events
     * If a tag is it will filter out events based on it
     * @param  {String} tag The tag to filter events (optional)
     * @return {Array}     The timeline array (or sub array if tag is defined)
     */
    getTimeline(tag: any): TimelineEvent[];
    /**
     * Used to add to the list of peers to get stats for
     * @param  {RTCPeerConnection} pc
     */
    private monitorPeer;
    /**
     * Used to start the setTimeout and request getStats from the peers
     *
     * configs used
     * monitoringSetInterval
     * getStatsInterval
     * promBased
     * peersToMonitor
     */
    private startMonitoring;
    private wrapGetUserMedia;
    /**
     * Used to get the tracks for local and remote tracks
     * @param  {RTCPeerConnection} pc
     * @return {Object}
     */
    private getPeerConnectionTracks;
    /**
     * Filter out some stats, mainly codec and certificate
     * @param  {Object} stats The parsed rtc stats object
     * @return {Object}       The new object with some keys deleted
     */
    private filteroutStats;
    private addPeerConnectionEventListeners;
    /**
     * Called when we get the stream from getUserMedia. We parse the stream and fire events
     * @param  {Object} options
     */
    private parseGetUserMedia;
    private parseStream;
    private getMediaTrackDetails;
    private getStreamDetails;
    /**
     * Add event listeners for the tracks that are added to the stream
     * @param {MediaStreamTrack} track
     */
    private addTrackEventListeners;
    private addToTimeline;
    /**
     * Used to emit a custome event and also add it to the timeline
     * @param {String} eventName The name of the custome event: track, getUserMedia, stats, etc
     * @param {Object} options   The object tha will be sent with the event
     */
    private addCustomEvent;
    private wrapGetDisplayMedia;
}
