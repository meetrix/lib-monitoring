/* eslint-disable no-async-promise-executor */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable @typescript-eslint/no-explicit-any */
/*
 *  Copyright (c) 2014 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */

import Debug from 'debug';
import adapter from 'webrtc-adapter';
import { enumerateStats } from './testUtil';

const debug = Debug('call class');

export interface ILocalTrackIds {
  audio: string;
  video: string;
}

export interface ICandidate {
  type: string;
  protocol: string;
  address: string;
}
class Call {
  pc1: RTCPeerConnection;

  pc2: RTCPeerConnection;

  // Store the ICE server response from the network traversal server.
  cachedIceServers_: any;

  // Keep track of when the request was made.
  // Keep track of when the request was made.
  cachedIceConfigFetchTime_!: number;

  constrainVideoBitrateKbps_!: number;

  constrainOfferToRemoveVideoFec_!: boolean;

  iceCandidateFilter_: any;

  localTrackIds!: ILocalTrackIds;

  remoteTrackIds!: ILocalTrackIds;

  statsGatheringRunning: boolean;

  getCachedIceCredentials_: any;

  constructor(config: RTCConfiguration) {
    debug('Call()');
    // this.traceEvent = report.traceEventAsync('call');
    // this.traceEvent({ config });
    this.statsGatheringRunning = false;

    this.pc1 = new RTCPeerConnection(config);
    this.pc2 = new RTCPeerConnection(config);

    this.pc1.addEventListener('icecandidate', this.onIceCandidate_.bind(this, this.pc2));
    this.pc2.addEventListener('icecandidate', this.onIceCandidate_.bind(this, this.pc1));

    this.iceCandidateFilter_ = this.noFilter;
  }

  establishConnection = async (): Promise<void> => {
    // this.traceEvent({ state: 'start' });
    debug('establishConnection()');
    const rtcSessionDescriptionInit = await this.pc1.createOffer();
    await this.gotOffer_(rtcSessionDescriptionInit);
  };

  close = (): void => {
    // this.traceEvent({ state: 'end' });
    this.pc1.close();
    this.pc2.close();
  };

  setIceCandidateFilter = (filter: any): void => {
    this.iceCandidateFilter_ = filter;
  };

  // Constraint max video bitrate by modifying the SDP when creating an answer.
  constrainVideoBitrate = (maxVideoBitrateKbps: number): void => {
    this.constrainVideoBitrateKbps_ = maxVideoBitrateKbps;
  };

  // Remove video FEC if available on the offer.
  disableVideoFec = (): void => {
    this.constrainOfferToRemoveVideoFec_ = true;
  };

  // When the peerConnection is closed the statsCb is called once with an array
  // of gathered stats.
  gatherStats = async (
    peerConnection: RTCPeerConnection,
    peerConnection2: RTCPeerConnection,
    localStream: any,
    statsCb: any,
  ): Promise<void> => {
    debug('gatherStats()');
    const stats: any = [];
    const stats2: any = [];
    const statsCollectTime: any = [];
    const statsCollectTime2: any = [];
    const self = this;
    const statStepMs = 100;
    self.localTrackIds = {
      audio: '',
      video: '',
    };
    self.remoteTrackIds = {
      audio: '',
      video: '',
    };

    peerConnection.getSenders().forEach((sender: RTCRtpSender) => {
      if (sender.track?.kind === 'audio') {
        self.localTrackIds.audio = sender.track.id;
      } else if (sender.track?.kind === 'video') {
        self.localTrackIds.video = sender.track?.id;
      }
    });

    if (peerConnection2) {
      peerConnection2.getReceivers().forEach((receiver: RTCRtpReceiver) => {
        if (receiver.track?.kind === 'audio') {
          self.remoteTrackIds.audio = receiver.track.id;
        } else if (receiver.track?.kind === 'video') {
          self.remoteTrackIds.video = receiver.track?.id;
        }
      });
    }

    this.statsGatheringRunning = true;

    // Stats for pc2, some stats are only available on the receiving end of a
    // peerconnection.
    const gotStats2_ = async (response: any) => {
      debug('gotStats2_()');
      if (adapter.browserDetails.browser === 'chrome') {
        const enumeratedStats = await enumerateStats(
          response,
          self.localTrackIds,
          self.remoteTrackIds,
        );
        stats2.push(enumeratedStats);
        statsCollectTime2.push(Date.now());
      } else if (adapter.browserDetails.browser === 'firefox') {
        for (const h in response) {
          const stat = response[h];
          stats2.push(stat);
          statsCollectTime2.push(Date.now());
        }
      } else {
        debug('Only Firefox and Chrome getStats implementations are supported.');
      }
    };

    const gotStats_ = async (response: any) => {
      debug('gotStats_()');
      // TODO: Remove browser specific stats gathering hack once adapter.js or
      // browsers converge on a standard.
      if (adapter.browserDetails.browser === 'chrome') {
        const enumeratedStats = await enumerateStats(
          response,
          self.localTrackIds,
          self.remoteTrackIds,
        );
        stats.push(enumeratedStats);
        statsCollectTime.push(Date.now());
      } else if (adapter.browserDetails.browser === 'firefox') {
        for (const j in response) {
          const stat = response[j];
          stats.push(stat);
          statsCollectTime.push(Date.now());
        }
      } else {
        debug('Only Firefox and Chrome getStats implementations are supported.');
      }
      setTimeout(getStats_, statStepMs);
    };

    const getStats_ = (): Promise<void> => {
      debug('getStats_()');
      return new Promise(async (resolve, reject) => {
        if (peerConnection.signalingState === 'closed') {
          self.statsGatheringRunning = false;
          statsCb(stats, statsCollectTime, stats2, statsCollectTime2);
          return resolve();
        }
        try {
          let rtcStatsReport = await peerConnection.getStats();
          await gotStats_(rtcStatsReport);

          if (peerConnection2) {
            rtcStatsReport = await peerConnection2.getStats();
            await gotStats2_(rtcStatsReport);
          }
          return resolve();
        } catch (error) {
          debug(`Could not gather stats: ${error}`);
          self.statsGatheringRunning = false;
          statsCb(stats, statsCollectTime);
          return reject();
        }
      });
    };
    await getStats_();
  };

  async gotOffer_(offer: RTCSessionDescriptionInit): Promise<void> {
    if (this.constrainOfferToRemoveVideoFec_) {
      offer.sdp = offer.sdp?.replace(/(m=video 1 [^\r]+)(116 117)(\r\n)/g, '$1\r\n');
      // offer.sdp = offer.sdp?.replace(/a=rtpmap:116 red\/90000\r\n/g, '');
      offer.sdp = offer.sdp?.replace(/a=rtpmap:117 ulpfec\/90000\r\n/g, '');
      offer.sdp = offer.sdp?.replace(/a=rtpmap:98 rtx\/90000\r\n/g, '');
      offer.sdp = offer.sdp?.replace(/a=fmtp:98 apt=116\r\n/g, '');
    }
    await this.pc1.setLocalDescription(offer);
    await this.pc2.setRemoteDescription(offer);
    const rtcSessionDescriptionInit = await this.pc2.createAnswer();
    await this.gotAnswer_(rtcSessionDescriptionInit);
  }

  async gotAnswer_(answer: RTCSessionDescriptionInit): Promise<void> {
    if (this.constrainVideoBitrateKbps_) {
      answer.sdp = answer.sdp?.replace(
        /a=mid:video\r\n/g,
        `a=mid:video\r\nb=AS:${this.constrainVideoBitrateKbps_}\r\n`,
      );
    }
    await this.pc2.setLocalDescription(answer);
    await this.pc1.setRemoteDescription(answer);
  }

  async onIceCandidate_(
    otherPeer: RTCPeerConnection,
    event: RTCPeerConnectionIceEvent,
  ): Promise<void> {
    if (event.candidate) {
      const parsed = this.parseCandidate(event.candidate.candidate);
      if (this.iceCandidateFilter_(parsed)) {
        await otherPeer.addIceCandidate(event.candidate);
      }
    }
  }

  noFilter = (): boolean => {
    return true;
  };

  isRelay = (candidate: RTCIceCandidate): boolean => {
    return candidate.type === 'relay';
  };

  isNotHostCandidate = (candidate: RTCIceCandidate): boolean => {
    return candidate.type !== 'host';
  };

  isReflexive = (candidate: RTCIceCandidate): boolean => {
    return candidate.type === 'srflx';
  };

  isHost = (candidate: RTCIceCandidate): boolean => {
    return candidate.type === 'host';
  };

  isIpv6 = (candidate: ICandidate): boolean => {
    return candidate.address?.indexOf(':') !== -1;
  };

  // Parse a 'candidate:' line into a JSON object.
  parseCandidate = (text: string): ICandidate => {
    const candidateStr = 'candidate:';
    const pos = text.indexOf(candidateStr) + candidateStr.length;
    const fields = text.substr(pos).split(' ');
    return {
      type: fields[7],
      protocol: fields[2],
      address: fields[4],
    };
  };
}

export default Call;
