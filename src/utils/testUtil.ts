/* eslint-disable no-async-promise-executor */
/* eslint-disable no-prototype-builtins */
/* eslint-disable @typescript-eslint/no-explicit-any */

import axios from 'axios';
import Debug from 'debug';
import { get, memoize } from 'lodash';

import { stun, turn } from '../config';
import API from './API';

let api: API;
export const setAPI = (apiInstance: API) => {
  api = apiInstance;
};

const debug = Debug('utils');

/*
 *  Copyright (c) 2014 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */
/* exported arrayAverage, arrayMax, arrayMin, enumerateStats */

// array<function> returns the average (down to nearest int), max and min of
// an int array.

export const arrayAverage = (array: number[]): number => {
  const cnt = array.length;
  let tot = 0;
  for (let i = 0; i < cnt; i += 1) {
    tot += array[i];
  }
  return Math.floor(tot / cnt);
};

export const arrayMax = (array: number[]): number => {
  if (array.length === 0) {
    return NaN;
  }
  return Math.max(...array);
};

export const arrayMin = (array: number[]): number => {
  if (array.length === 0) {
    return NaN;
  }
  return Math.min(...array);
};

// Enumerates the new standard compliant stats using local and remote track ids.
export const enumerateStats = (stats: any, localTrackIds: any, remoteTrackIds: any): any => {
  // Create an object structure with all the needed stats and types that we care
  // about. This allows to map the getStats stats to other stats names.
  const statsObject = {
    audio: {
      local: {
        audioLevel: 0.0,
        bytesSent: 0,
        clockRate: 0,
        codecId: '',
        mimeType: '',
        packetsSent: 0,
        payloadType: 0,
        timestamp: 0.0,
        trackId: '',
        transportId: '',
      },
      remote: {
        audioLevel: 0.0,
        bytesReceived: 0,
        clockRate: 0,
        codecId: '',
        fractionLost: 0,
        jitter: 0,
        mimeType: '',
        packetsLost: -1,
        packetsReceived: 0,
        payloadType: 0,
        timestamp: 0.0,
        trackId: '',
        transportId: '',
      },
    },
    video: {
      local: {
        bytesSent: 0,
        clockRate: 0,
        codecId: '',
        firCount: 0,
        framesEncoded: 0,
        frameHeight: 0,
        framesSent: -1,
        frameWidth: 0,
        mimeType: '',
        nackCount: 0,
        packetsSent: -1,
        payloadType: 0,
        pliCount: 0,
        qpSum: 0,
        timestamp: 0.0,
        trackId: '',
        transportId: '',
      },
      remote: {
        bytesReceived: -1,
        clockRate: 0,
        codecId: '',
        firCount: -1,
        fractionLost: 0,
        frameHeight: 0,
        framesDecoded: 0,
        framesDropped: 0,
        framesReceived: 0,
        frameWidth: 0,
        mimeType: '',
        nackCount: -1,
        packetsLost: -1,
        packetsReceived: 0,
        payloadType: 0,
        pliCount: -1,
        qpSum: 0,
        timestamp: 0.0,
        trackId: '',
        transportId: '',
      },
    },
    connection: {
      availableOutgoingBitrate: 0,
      bytesReceived: 0,
      bytesSent: 0,
      consentRequestsSent: 0,
      currentRoundTripTime: 0.0,
      localCandidateId: '',
      localCandidateType: '',
      localIp: '',
      localPort: 0,
      localPriority: 0,
      localProtocol: '',
      localType: '',
      remoteCandidateId: '',
      remoteCandidateType: '',
      remoteIp: '',
      remotePort: 0,
      remotePriority: 0,
      remoteProtocol: '',
      remoteType: '',
      requestsReceived: 0,
      requestsSent: 0,
      responsesReceived: 0,
      responsesSent: 0,
      timestamp: 0.0,
      totalRoundTripTime: 0.0,
    },
  };

  // Need to find the codec, local and remote ID's first.
  if (stats) {
    stats.forEach((report: any) => {
      switch (report.type) {
        case 'outbound-rtp':
          if (report.hasOwnProperty('trackId')) {
            if (report.trackId.indexOf(localTrackIds.audio) !== 1 && localTrackIds.audio !== '') {
              statsObject.audio.local.bytesSent = report.bytesSent;
              statsObject.audio.local.codecId = report.codecId;
              statsObject.audio.local.packetsSent = report.packetsSent;
              statsObject.audio.local.timestamp = report.timestamp;
              statsObject.audio.local.trackId = report.trackId;
              statsObject.audio.local.transportId = report.transportId;
            } else if (
              report.trackId.indexOf(localTrackIds.video) !== 1 &&
              localTrackIds.video !== ''
            ) {
              statsObject.video.local.bytesSent = report.bytesSent;
              statsObject.video.local.codecId = report.codecId;
              statsObject.video.local.firCount = report.firCount;
              statsObject.video.local.framesEncoded = report.framesEncoded;
              statsObject.video.local.framesSent = report.framesSent;
              statsObject.video.local.packetsSent = report.packetsSent;
              statsObject.video.local.pliCount = report.pliCount;
              statsObject.video.local.qpSum = report.qpSum;
              statsObject.video.local.timestamp = report.timestamp;
              statsObject.video.local.trackId = report.trackId;
              statsObject.video.local.transportId = report.transportId;
            }
          }
          break;
        case 'inbound-rtp':
          if (report.hasOwnProperty('trackId')) {
            if (report.trackId.indexOf(remoteTrackIds.audio) !== 1 && remoteTrackIds.audio !== '') {
              statsObject.audio.remote.bytesReceived = report.bytesReceived;
              statsObject.audio.remote.codecId = report.codecId;
              statsObject.audio.remote.fractionLost = report.fractionLost;
              statsObject.audio.remote.jitter = report.jitter;
              statsObject.audio.remote.packetsLost = report.packetsLost;
              statsObject.audio.remote.packetsReceived = report.packetsReceived;
              statsObject.audio.remote.timestamp = report.timestamp;
              statsObject.audio.remote.trackId = report.trackId;
              statsObject.audio.remote.transportId = report.transportId;
            }
            if (report.trackId.indexOf(remoteTrackIds.video) !== 1 && remoteTrackIds.video !== '') {
              statsObject.video.remote.bytesReceived = report.bytesReceived;
              statsObject.video.remote.codecId = report.codecId;
              statsObject.video.remote.firCount = report.firCount;
              statsObject.video.remote.fractionLost = report.fractionLost;
              statsObject.video.remote.nackCount = report.nackCount;
              statsObject.video.remote.packetsLost = report.packetsLost;
              statsObject.video.remote.packetsReceived = report.packetsReceived;
              statsObject.video.remote.pliCount = report.pliCount;
              statsObject.video.remote.qpSum = report.qpSum;
              statsObject.video.remote.timestamp = report.timestamp;
              statsObject.video.remote.trackId = report.trackId;
              statsObject.video.remote.transportId = report.transportId;
            }
          }
          break;
        case 'candidate-pair':
          if (report.hasOwnProperty('availableOutgoingBitrate')) {
            statsObject.connection.availableOutgoingBitrate = report.availableOutgoingBitrate;
            statsObject.connection.bytesReceived = report.bytesReceived;
            statsObject.connection.bytesSent = report.bytesSent;
            statsObject.connection.consentRequestsSent = report.consentRequestsSent;
            statsObject.connection.currentRoundTripTime = report.currentRoundTripTime;
            statsObject.connection.localCandidateId = report.localCandidateId;
            statsObject.connection.remoteCandidateId = report.remoteCandidateId;
            statsObject.connection.requestsReceived = report.requestsReceived;
            statsObject.connection.requestsSent = report.requestsSent;
            statsObject.connection.responsesReceived = report.responsesReceived;
            statsObject.connection.responsesSent = report.responsesSent;
            statsObject.connection.timestamp = report.timestamp;
            statsObject.connection.totalRoundTripTime = report.totalRoundTripTime;
          }
          break;
        default:
      }
    });

    // Using the codec, local and remote candidate ID's to find the rest of the
    // relevant stats.
    stats.forEach((report: any) => {
      switch (report.type) {
        case 'track':
          if (report.hasOwnProperty('trackIdentifier')) {
            if (
              report.trackIdentifier.indexOf(localTrackIds.video) !== 1 &&
              localTrackIds.video !== ''
            ) {
              statsObject.video.local.frameHeight = report.frameHeight;
              statsObject.video.local.framesSent = report.framesSent;
              statsObject.video.local.frameWidth = report.frameWidth;
            }
            if (
              report.trackIdentifier.indexOf(remoteTrackIds.video) !== 1 &&
              remoteTrackIds.video !== ''
            ) {
              statsObject.video.remote.frameHeight = report.frameHeight;
              statsObject.video.remote.framesDecoded = report.framesDecoded;
              statsObject.video.remote.framesDropped = report.framesDropped;
              statsObject.video.remote.framesReceived = report.framesReceived;
              statsObject.video.remote.frameWidth = report.frameWidth;
            }
            if (
              report.trackIdentifier.indexOf(localTrackIds.audio) !== 1 &&
              localTrackIds.audio !== ''
            ) {
              statsObject.audio.local.audioLevel = report.audioLevel;
            }
            if (
              report.trackIdentifier.indexOf(remoteTrackIds.audio) !== 1 &&
              remoteTrackIds.audio !== ''
            ) {
              statsObject.audio.remote.audioLevel = report.audioLevel;
            }
          }
          break;
        case 'codec':
          if (report.hasOwnProperty('id')) {
            if (
              report.id.indexOf(statsObject.audio.local.codecId) !== 1 &&
              localTrackIds.audio !== ''
            ) {
              statsObject.audio.local.clockRate = report.clockRate;
              statsObject.audio.local.mimeType = report.mimeType;
              statsObject.audio.local.payloadType = report.payloadType;
            }
            if (
              report.id.indexOf(statsObject.audio.remote.codecId) !== 1 &&
              remoteTrackIds.audio !== ''
            ) {
              statsObject.audio.remote.clockRate = report.clockRate;
              statsObject.audio.remote.mimeType = report.mimeType;
              statsObject.audio.remote.payloadType = report.payloadType;
            }
            if (
              report.id.indexOf(statsObject.video.local.codecId) !== 1 &&
              localTrackIds.video !== ''
            ) {
              statsObject.video.local.clockRate = report.clockRate;
              statsObject.video.local.mimeType = report.mimeType;
              statsObject.video.local.payloadType = report.payloadType;
            }
            if (
              report.id.indexOf(statsObject.video.remote.codecId) !== 1 &&
              remoteTrackIds.video !== ''
            ) {
              statsObject.video.remote.clockRate = report.clockRate;
              statsObject.video.remote.mimeType = report.mimeType;
              statsObject.video.remote.payloadType = report.payloadType;
            }
          }
          break;
        case 'local-candidate':
          if (report.hasOwnProperty('id')) {
            if (report.id.indexOf(statsObject.connection.localCandidateId) !== -1) {
              statsObject.connection.localIp = report.ip;
              statsObject.connection.localPort = report.port;
              statsObject.connection.localPriority = report.priority;
              statsObject.connection.localProtocol = report.protocol;
              statsObject.connection.localType = report.candidateType;
            }
          }
          break;
        case 'remote-candidate':
          if (report.hasOwnProperty('id')) {
            if (report.id.indexOf(statsObject.connection.remoteCandidateId) !== -1) {
              statsObject.connection.remoteIp = report.ip;
              statsObject.connection.remotePort = report.port;
              statsObject.connection.remotePriority = report.priority;
              statsObject.connection.remoteProtocol = report.protocol;
              statsObject.connection.remoteType = report.candidateType;
            }
          }
          break;
        default:
      }
    });
  }
  return statsObject;
};

// implement this progress bar

const setTestProgress = (progress: number) => {
  debug('progress : ', progress);
};

export const setTimeoutWithProgressBar = (timeoutMs: number): Promise<void> => {
  return new Promise(async (resolve, reject) => {
    debug('setTimeoutWithProgressBar()');
    const start = window.performance.now();
    const updateProgressBar = setInterval(() => {
      const now = window.performance.now();
      setTestProgress(((now - start) * 100) / timeoutMs);
    }, 100);

    const timeoutTask = () => {
      clearInterval(updateProgressBar);
      setTestProgress(100);
      resolve();
    };
    setTimeout(timeoutTask, timeoutMs);
    // const finishProgressBar = () => {
    //   clearTimeout(timer);
    //   timeoutTask();
    // };
  });
  // return finishProgressBar;
};

// Ask network traversal API to give us TURN server credentials and URLs.
// fetchTurnConfig_ = (onSuccess: any, onError: any) => {
//   // Check if credentials exist or have expired (and subtract testRuntTIme so
//   // that the test can finish if near the end of the lifetime duration).
//   // lifetimeDuration is in seconds.
//   const testRunTime = 240; // Time in seconds to allow a test run to complete.
//   if (this.cachedIceServers_) {
//     const isCachedIceConfigExpired =
//       (Date.now() - this.cachedIceConfigFetchTime_) / 1000 >
//       parseInt(this.cachedIceServers_.lifetimeDuration, 10) - testRunTime;
//     if (!isCachedIceConfigExpired) {
//       // report.traceEventInstant(
//       //   'fetch-ice-config',
//       //   'Using cached credentials.'
//       // );
//       onSuccess(this.getCachedIceCredentials_());
//       return;
//     }
//   }

//   const xhr = new XMLHttpRequest();
//   const onResult = () => {
//     if (xhr.readyState !== 4) {
//       return;
//     }

//     if (xhr.status !== 200) {
//       onError('TURN request failed');
//       return;
//     }

//     const response = JSON.parse(xhr.responseText);
//     this.cachedIceServers_ = response;
//     this.getCachedIceCredentials_ = () => {
//       // Make a new object due to tests modifying the original response object.
//       return JSON.parse(JSON.stringify(this.cachedIceServers_));
//     };
//     this.cachedIceConfigFetchTime_ = Date.now();
//     // report.traceEventInstant('fetch-ice-config', 'Fetching new credentials.');
//     onSuccess(this.getCachedIceCredentials_());
//   };

//   xhr.onreadystatechange = onResult;
//   // API_KEY and TURN_URL is replaced with API_KEY environment variable via
//   // Gruntfile.js during build time by uglifyJS.
//   xhr.open('POST', TURN_URL + API_KEY, true);
//   xhr.send();
// };

// Get a STUN config, either from settings or from network traversal server.
export const asyncCreateStunConfig = (): RTCConfiguration => {
  // if (typeof settings.stunURI === 'string' && settings.stunURI !== '') {
  const iceServer = {
    urls: stun.uri.split(','),
  };
  const config = { iceServers: [iceServer] };
  // report.traceEventInstant('stun-config', config);
  return config;

  // setTimeout(onSuccess.bind(null, config), 0);
  // } else {
  //   this.fetchTurnConfig_((response: any) => {
  //     const config = { iceServers: response.iceServers.urls };
  //     // report.traceEventInstant('stun-config', config);
  //     onSuccess(config);
  //   }, onError);
  // }
};

// Get a TURN config, either from settings or from network traversal server.
export const asyncCreateTurnConfigDefault = (): RTCConfiguration => {
  // if (typeof settings.turnURI === 'string' && settings.turnURI !== '') {
  const iceServer = {
    username: turn.username || '',
    credential: turn.credential || '',
    urls: turn.uri.split(','),
  };
  const config = { iceServers: [iceServer] };
  // report.traceEventInstant('turn-config', config);
  return config;

  // setTimeout(onSuccess.bind(null, config), 0);
  // } else {
  //   this.fetchTurnConfig_((response: any) => {
  //     const config = { iceServers: response.iceServers };
  //     // report.traceEventInstant('turn-config', config);
  //     onSuccess(config);
  //   }, onError);
  // }
};

export const asyncCreateTurnConfig = memoize(
  async (): Promise<RTCConfiguration> => {
    const iceServersConfig = (await api.rest?.get('/plugins/ice-servers'))?.data?.data;

    if (iceServersConfig) {
      return iceServersConfig;
    }

    return asyncCreateTurnConfigDefault();
  },
  // Cache only for a minute
  () => Math.ceil(Date.now() / 1000 / 60),
);

export const doGetUserMedia = async (constraints: MediaStreamConstraints): Promise<MediaStream> => {
  // const traceGumEvent = report.traceEventAsync('getusermedia');
  return new Promise(async (resolve, reject) => {
    try {
      // Append the constraints with the getSource constraints.
      // this!.appendSourceId(this!.$.audioSource.value, 'audio', constraints);
      // this!.appendSourceId(this!.$.videoSource.value, 'video', constraints);

      // traceGumEvent({ status: 'pending', constraints });
      // Call into getUserMedia via the polyfill (adapter.js).
      debug('getUserMedia()');
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      //   const cam = self.getDeviceName_(stream.getVideoTracks());
      //   const mic = self.getDeviceName_(stream.getAudioTracks());
      // traceGumEvent({ status: 'success', camera: cam, microphone: mic });
      resolve(stream);
    } catch (e) {
      debug(e);
      reject(e);
      // traceGumEvent({ status: 'exception', error: e.message });
      debug(`getUserMedia failed with exception: ${(e as Error).message}`);
    }
  });
};
