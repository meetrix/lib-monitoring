/* eslint-disable no-async-promise-executor */
/* eslint-disable no-restricted-syntax */
/*
 *  Copyright (c) 2014 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */

import Debug from 'debug';

import Call, { ICandidate } from '../../call';
import { asyncCreateTurnConfig } from '../../testUtil';
import { TestEvent, TestEventCallback } from '../TestEvent';

const debug = Debug('connectionTest');

let timeout: ReturnType<typeof setTimeout>;
const parsedCandidates: ICandidate[] = [];
let type: string;
let report: TestEventCallback;
let CallClass: Call;
let iceCandidateFilter: any;

const initConnectionTest = async (
  callback: TestEventCallback,
  iceCandidateFilterArg: any,
  typeArg: string,
) => {
  type = typeArg;
  report = callback;
  iceCandidateFilter = iceCandidateFilterArg;
  report(TestEvent.START, type);
  return runConnectionTest();
};

const runConnectionTest = async () => {
  debug('runConnectionTest()');
  const config = await asyncCreateTurnConfig();
  return start(config);
};

const start = async (config: RTCConfiguration) => {
  debug('start()');
  CallClass = new Call(config);
  CallClass.setIceCandidateFilter(iceCandidateFilter);

  // Collect all candidates for validation.
  CallClass.pc1.addEventListener('icecandidate', event => {
    if (event.candidate) {
      const parsedCandidate = CallClass.parseCandidate(event.candidate.candidate);
      parsedCandidates.push(parsedCandidate);

      // Report candidate info based on iceCandidateFilter.
      if (iceCandidateFilter(parsedCandidate)) {
        report(TestEvent.MESSAGE, [
          type,
          `[ INFO ] Gathered candidate of Type: ${parsedCandidate.type} Protocol: ${parsedCandidate.protocol} Address: ${parsedCandidate.address}`,
        ]);
      }
    }
  });

  const ch1 = CallClass.pc1.createDataChannel('datachannel');
  ch1.addEventListener('open', async () => {
    ch1.send('hello');
  });

  ch1.addEventListener('message', event => {
    if (event.data !== 'world') {
      report(TestEvent.MESSAGE, [type, '[ FAILED ] Invalid data transmitted.']);
    } else {
      report(TestEvent.MESSAGE, [type, '[ OK ] Data successfully transmitted between peers.']);
    }
    hangup('');
  });

  CallClass.pc2.addEventListener('datachannel', event => {
    const ch2 = event.channel;
    ch2.addEventListener('message', async eventArg => {
      if (eventArg.data !== 'hello') {
        hangup('Invalid data transmitted.');
      } else {
        ch2.send('world');
      }
    });
  });

  await CallClass.establishConnection();
  timeout = setTimeout(hangup.bind(this, 'Timed out'), 5000);
};

const findParsedCandidateOfSpecifiedType = (candidateTypeMethod: any): boolean => {
  debug('findParsedCandidateOfSpecifiedType()');
  for (const candidate in parsedCandidates) {
    if (candidateTypeMethod(parsedCandidates[candidate])) {
      return candidateTypeMethod(parsedCandidates[candidate]);
    }
  }
  return false;
};

const hangup = async (errorMessage: string) => {
  debug('hangup()');
  if (errorMessage) {
    // Report warning for server reflexive test if it times out.
    if (
      errorMessage === 'Timed out' &&
      iceCandidateFilter.toString() === CallClass.isReflexive.toString() &&
      findParsedCandidateOfSpecifiedType(CallClass.isReflexive)
    ) {
      report(TestEvent.MESSAGE, [
        type,
        '[ WARN ] Could not connect using reflexive candidates, likely due to the network environment/configuration.',
      ]);
    } else {
      report(TestEvent.MESSAGE, [type, `[ FAILED ] ${errorMessage}`]);
    }
    report(TestEvent.END, [type, 'failure']);
  } else {
    report(TestEvent.END, [type, 'success']);
  }
  clearTimeout(timeout);
  CallClass.close();
};

const sleep = (time: number): Promise<void> => {
  return new Promise(async (resolve, reject) => {
    setTimeout(() => resolve(), time);
  });
};

const runConnectionTests = async (callback: TestEventCallback): Promise<boolean> => {
  const CallClass2 = new Call({});
  await sleep(1000);
  debug(Date.now());
  // Set up a datachannel between two peers through a relay
  // and verify data can be transmitted and received
  // (packets travel through the public internet)
  const relay = await initConnectionTest(callback, CallClass2.isRelay, 'relay');
  await sleep(5000);
  debug(Date.now());
  // Set up a datachannel between two peers through a public IP address
  // and verify data can be transmitted and received
  // (packets should stay on the link if behind a router doing NAT)
  const reflexive = await initConnectionTest(callback, CallClass2.isReflexive, 'reflexive');
  await sleep(5000);
  debug(Date.now());
  // Set up a datachannel between two peers through a local IP address
  // and verify data can be transmitted and received
  // (packets should not leave the machine running the test)
  const host = await initConnectionTest(callback, CallClass2.isHost, 'host');
  await sleep(5000);
  debug(Date.now());

  // return relay && reflexive && host;
  // TODO: Properly track test flow and return the correct result
  return true;
};

export default runConnectionTests;
