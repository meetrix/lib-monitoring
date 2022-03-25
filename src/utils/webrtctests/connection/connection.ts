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
import { Dispatch } from '@reduxjs/toolkit';
import Call, { ICandidate } from '../../call';
import { actions as connectionActions } from '../../../ui/slice/connection/connection.slice';
import { asyncCreateTurnConfig } from '../../testUtil';

const debug = Debug('connectionTest');

let timeout: ReturnType<typeof setTimeout>;
const parsedCandidates: ICandidate[] = [];
let type: string;
let dispatch: Dispatch;
let CallClass: Call;
let iceCandidateFilter: any;

const initConnectionTest = async (
  dispatchArg: Dispatch,
  iceCandidateFilterArg: any,
  typeArg: string
) => {
  type = typeArg;
  dispatch = dispatchArg;
  iceCandidateFilter = iceCandidateFilterArg;
  dispatch(connectionActions.startTest(type));
  await runConnectionTest();
};

const runConnectionTest = async () => {
  debug('runConnectionTest()');
  const config = asyncCreateTurnConfig();
  await start(config);
};

const start = async (config: RTCConfiguration) => {
  debug('start()');
  CallClass = new Call(config);
  CallClass.setIceCandidateFilter(iceCandidateFilter);

  // Collect all candidates for validation.
  CallClass.pc1.addEventListener('icecandidate', async event => {
    if (event.candidate) {
      const parsedCandidate = CallClass.parseCandidate(event.candidate.candidate);
      parsedCandidates.push(parsedCandidate);

      // Report candidate info based on iceCandidateFilter.
      if (iceCandidateFilter(parsedCandidate)) {
        dispatch(
          connectionActions.addSubMessage([
            type,
            `[ INFO ] Gathered candidate of Type: ${parsedCandidate.type} Protocol: ${parsedCandidate.protocol} Address: ${parsedCandidate.address}`
          ])
        );
      }
    }
  });

  const ch1 = await CallClass.pc1.createDataChannel('datachannel');
  ch1.addEventListener('open', async () => {
    await ch1.send('hello');
  });
  ch1.addEventListener('message', event => {
    if (event.data !== 'world') {
      dispatch(connectionActions.addSubMessage([type, '[ FAILED ] Invalid data transmitted.']));
    } else {
      dispatch(
        connectionActions.addSubMessage([
          type,
          '[ OK ] Data successfully transmitted between peers.'
        ])
      );
    }
    hangup('');
  });
  CallClass.pc2.addEventListener('datachannel', event => {
    const ch2 = event.channel;
    ch2.addEventListener('message', async eventArg => {
      if (eventArg.data !== 'hello') {
        hangup('Invalid data transmitted.');
      } else {
        await ch2.send('world');
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
      dispatch(
        connectionActions.addSubMessage([
          type,
          '[ WARN ] Could not connect using reflexive candidates, likely due to the network environment/configuration.'
        ])
      );
    } else {
      dispatch(connectionActions.addSubMessage([type, `[ FAILED ] ${errorMessage}`]));
    }
    dispatch(connectionActions.endTest([type, 'failure']));
  } else {
    dispatch(connectionActions.endTest([type, 'success']));
  }
  await clearTimeout(timeout);
  await CallClass.close();
};

const sleep = (time: number): Promise<void> => {
  return new Promise(async (resolve, reject) => {
    setTimeout(() => resolve(), time);
  });
};

const runConnectionTests = async (dispatchArg: Dispatch): Promise<void> => {
  const CallClass2 = new Call({});
  await sleep(1000);
  debug(Date.now());
  // Set up a datachannel between two peers through a relay
  // and verify data can be transmitted and received
  // (packets travel through the public internet)
  await initConnectionTest(dispatchArg, CallClass2.isRelay, 'relay');
  await sleep(5000);
  debug(Date.now());
  // Set up a datachannel between two peers through a public IP address
  // and verify data can be transmitted and received
  // (packets should stay on the link if behind a router doing NAT)
  await initConnectionTest(dispatchArg, CallClass2.isReflexive, 'reflexive');
  await sleep(5000);
  debug(Date.now());
  // Set up a datachannel between two peers through a local IP address
  // and verify data can be transmitted and received
  // (packets should not leave the machine running the test)
  await initConnectionTest(dispatchArg, CallClass2.isHost, 'host');
  await sleep(5000);
  debug(Date.now());
};

export default runConnectionTests;
