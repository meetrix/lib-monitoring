/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable no-async-promise-executor */
/*
 *  Copyright (c) 2015 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */

import Debug from 'debug';

import Call from '../../call';
import { asyncCreateTurnConfig } from '../../testUtil';
import { TestEvent, TestEventCallback } from '../TestEvent';

const debug = Debug('networkTest');

let protocol: string;
let params: any;
let type: string;
let report: TestEventCallback;
let CallClass: Call;

const initNetworkTest = async (
  callback: TestEventCallback,
  protocolArg: string,
  paramsArg: any,
  typeArg: string
): Promise<boolean> => {
  type = typeArg;
  report = callback;
  protocol = protocolArg;
  params = paramsArg;
  CallClass = new Call({});
  report(TestEvent.START, type);
  return runNetworkTest();
};

const runNetworkTest = async (): Promise<boolean> => {
  debug('runNetworkTest()');
  // Do not create turn config for IPV6 test.
  if (type === 'ipv6') {
    return gatherCandidates({});
  } else {
    let config = asyncCreateTurnConfig();
    config = filterConfig(config);
    return gatherCandidates(config);
  }
};

// Filter the RTCConfiguration |config| to only contain URLs with the
// specified transport protocol |protocol|. If no turn transport is
// specified it is added with the requested protocol.
const filterConfig = (config: RTCConfiguration) => {
  debug('filterConfig()');
  const transport = `transport=${protocol}`;
  const newIceServers = [];
  if (!config.iceServers) {
    return {};
  }
  for (let i = 0; i < config.iceServers.length; i += 1) {
    const iceServer = config.iceServers[i];
    const newUrls = [];
    for (let j = 0; j < iceServer.urls.length; j += 1) {
      const uri = iceServer.urls[j];
      if (uri.indexOf(transport) !== -1) {
        newUrls.push(uri);
      } else if (uri.indexOf('?transport=') === -1 && uri.startsWith('turn')) {
        newUrls.push(`${uri}?${transport}`);
      }
    }
    if (newUrls.length !== 0) {
      iceServer.urls = newUrls;
      newIceServers.push(iceServer);
    }
  }
  config.iceServers = newIceServers;
  return config;
};

// Create a PeerConnection, and gather candidates using RTCConfig |config|
// and ctor params |params|. Succeed if any candidates pass the |isGood|
// check, fail if we complete gathering without any passing.
const gatherCandidates = async (config: any): Promise<boolean> => {
  debug('gatherCandidates()');
  let pc: RTCPeerConnection;
  let iceCandidateFilterFunction: Function;
  if (type === 'ipv6') {
    iceCandidateFilterFunction = CallClass.isIpv6;
  } else {
    iceCandidateFilterFunction = CallClass.isRelay;
  }

  try {
    // debug({ ...config, ...params });
    pc = new RTCPeerConnection({ ...config, ...params });
  } catch (error) {
    if (params !== null && params.optional[0].googIPv6) {
      report(TestEvent.MESSAGE, [
        type,
        '[ WARN ] Failed to create peer connection, IPv6 ' +
          'might not be setup/supported on the network.'
      ]);
    } else {
      report(TestEvent.MESSAGE, [type, `[ FAILED ] Failed to create peer connection: ${error}`]);
    }

    report(TestEvent.END, [type, 'failure']);
    return false;
  }

  const promise = new Promise<boolean>(async resolve => {
    // In our candidate callback, stop if we get a candidate that passes
    // |isGood|.
    pc.addEventListener('icecandidate', e => {
      // TODO: Fix: events are firing after we end the method
      // Once we've decided, ignore future callbacks.
      // if (e.currentTarget?.signalingState === 'closed') {
      //   return;
      // }
      // debug(e);
      if (e.candidate) {
        const parsed = CallClass.parseCandidate(e.candidate.candidate);
        if (iceCandidateFilterFunction(parsed)) {
          report(TestEvent.MESSAGE, [
            type,
            `[ OK ] Gathered candidate of Type: ${parsed.type} Protocol: ${parsed.protocol} Address: ${parsed.address}`
          ]);
          pc.close();
          // = null;
          report(TestEvent.END, [type, 'success']);
          resolve(true);
          return;
        }
        resolve(false);
      } else {
        pc.close();
        // pc = null;
        if (type === 'ipv6') {
          report(TestEvent.MESSAGE, [
            type,
            '[ WARN ] Failed to gather IPv6 candidates, it ' +
              'might not be setup/supported on the network.'
          ]);
        } else {
          report(TestEvent.MESSAGE, [type, '[ FAILED ] Failed to gather specified candidates']);
        }
        report(TestEvent.END, [type, 'failure']);
        resolve(false);
      }
    });
  });

  await createAudioOnlyReceiveOffer(pc);

  return promise;
};

// Create an audio-only, recvonly offer, and setLD with it.
// This will trigger candidate gathering.
const createAudioOnlyReceiveOffer = async (pc: RTCPeerConnection) => {
  debug('createAudioOnlyReceiveOffer()');
  const createOfferParams = { offerToReceiveAudio: true };
  const offer = await pc.createOffer(createOfferParams);
  await pc.setLocalDescription(offer);
};

const sleep = (time: number): Promise<void> => {
  return new Promise(async (resolve, reject) => {
    setTimeout(() => resolve(), time);
  });
};

const runNetworkTests = async (callback: TestEventCallback): Promise<boolean> => {
  await sleep(1000);
  debug(Date.now());

  // Test whether it can connect via UDP to a TURN server
  // Get a TURN config, and try to get a relay candidate using UDP.

  const udp = await initNetworkTest(callback, 'udp', null, 'udp');
  await sleep(5000);
  debug(Date.now());

  // Test whether it can connect via TCP to a TURN server
  // Get a TURN config, and try to get a relay candidate using TCP.

  const tcp = await initNetworkTest(callback, 'tcp', null, 'tcp');
  await sleep(5000);
  debug(Date.now());

  // Test whether it is IPv6 enabled (TODO: test IPv6 to a destination).
  // Turn on IPv6, and try to get an IPv6 host candidate.

  const ipv6 = await initNetworkTest(callback, '', { optional: [{ googIPv6: true }] }, 'ipv6');
  await sleep(5000);
  debug(Date.now());

  return [udp, tcp, ipv6].every(Boolean);
};

export default runNetworkTests;
