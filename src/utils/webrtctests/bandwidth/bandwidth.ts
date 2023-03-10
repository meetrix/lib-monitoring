/* eslint-disable prefer-destructuring */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-async-promise-executor */
/*
 *  Copyright (c) 2014 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */

// Creates a loopback via relay candidates and tries to send as many packets
// with 1024 chars as possible while keeping dataChannel bufferedAmount above
// zero.

import Debug from 'debug';
import adapter from 'webrtc-adapter';

import Call from '../../call';
import { asyncCreateTurnConfig, doGetUserMedia } from '../../testUtil';
import { TestEvent, TestEventCallback } from '../TestEvent';
import StatisticsAggregate from './stats';

const debug = Debug('bandwidthTest');

const testDurationSeconds = 5.0;
let startTime: number;
let sentPayloadBytes = 0;
let receivedPayloadBytes = 0;
let stopSending = false;
let samplePacket = '';
let report: TestEventCallback;

let throughputPassed = false;
let videoBandwidthPassed = false;

for (let i = 0; i !== 1024; i += 1) {
  samplePacket += 'h';
}

const maxNumberOfPacketsToSend = 1;
const bytesToKeepBuffered = 1024 * maxNumberOfPacketsToSend;
let lastBitrateMeasureTime = 0;
let lastReceivedPayloadBytes = 0;
let callClass: Call;
let senderChannel: RTCDataChannel;
let receiveChannel: RTCDataChannel;

const initBandwidthTestThroughput = async (callback: TestEventCallback) => {
  debug('initBandwidthTestThroughput()');
  report = callback;
  report(TestEvent.START, 'throughput');
  const config = await asyncCreateTurnConfig();
  await runBandwidthTestThroughput(config);
};

const initBandwidthTestVideoBandwidth = async (callback: TestEventCallback) => {
  debug('initBandwidthTestVideoBandwidth()');
  report = callback;
  report(TestEvent.START, 'videoBandwidth');
  const config = await asyncCreateTurnConfig();
  await runBandwidthTestVideoBandwidth(config);
};

const runBandwidthTestThroughput = async (config: RTCConfiguration) => {
  debug('runBandwidthTestThroughput()');
  callClass = new Call(config);
  await callClass.setIceCandidateFilter(callClass.isRelay);
  senderChannel = await callClass.pc1.createDataChannel('datachannel');
  senderChannel.addEventListener('open', sendingStep);

  callClass.pc2.addEventListener('datachannel', onReceiverChannel);

  await callClass.establishConnection();
};

const onReceiverChannel = (event: RTCDataChannelEvent) => {
  debug('onReceiverChannel()');
  receiveChannel = event.channel;
  receiveChannel.addEventListener(TestEvent.MESSAGE, onMessageReceived);
};

const sendingStep = () => {
  debug('sendingStep()');
  const now = Date.now();
  if (!startTime) {
    startTime = now;
    lastBitrateMeasureTime = now;
  }

  for (let i = 0; i !== maxNumberOfPacketsToSend; i += 1) {
    if (senderChannel.bufferedAmount >= bytesToKeepBuffered) {
      break;
    }
    sentPayloadBytes += samplePacket.length;
    senderChannel.send(samplePacket);
  }

  if (now - startTime >= 1000 * testDurationSeconds) {
    // this.test.setProgress(100);
    stopSending = true;
  } else {
    // this.test.setProgress(
    //   (now - this.startTime) / (10 * this.testDurationSeconds)
    // );
    setTimeout(sendingStep, 1);
  }
};

const onMessageReceived = async (event: MessageEvent) => {
  debug('onMessageReceived()');
  receivedPayloadBytes += event.data.length;
  const now = Date.now();
  if (now - lastBitrateMeasureTime >= 1000) {
    let bitrate =
      (receivedPayloadBytes - lastReceivedPayloadBytes) / (now - lastBitrateMeasureTime);
    bitrate = Math.round(bitrate * 1000 * 8) / 1000;
    report(TestEvent.MESSAGE, ['throughput', `[ OK ] Transmitting at ${bitrate} kbps.`]);

    lastReceivedPayloadBytes = receivedPayloadBytes;
    lastBitrateMeasureTime = now;
  }
  if (stopSending && sentPayloadBytes === receivedPayloadBytes) {
    await callClass.close();
    // callClass = null;

    const elapsedTime = Math.round((now - startTime) * 10) / 10000.0;
    const receivedKBits = (receivedPayloadBytes * 8) / 1000;
    report(TestEvent.MESSAGE, [
      'throughput',
      `[ OK ] Total transmitted: ${receivedKBits} kilo-bits in ${elapsedTime} seconds.`,
    ]);
    report(TestEvent.END, ['throughput', 'success']);
    throughputPassed = true;
  }
};

// Measures video bandwidth estimation performance by doing a loopback call via
// relay candidates for 40 seconds. Computes rtt and bandwidth estimation
// average and maximum as well as time to ramp up (defined as reaching 75% of
// the max bitrate. It reports infinite time to ramp up if never reaches it.

const maxVideoBitrateKbps = 2000;
const durationMs = 40000;
const statStepMs = 100;
const bweStats = new StatisticsAggregate(0.75 * maxVideoBitrateKbps * 1000);
const rttStats = new StatisticsAggregate(0);
let packetsLost = -1;
let nackCount = -1;
let pliCount = -1;
let qpSum = -1;
let packetsSent = -1;
let packetsReceived = -1;
let framesEncoded = -1;
let framesDecoded = -1;
// const framesSent = -1;
// const bytesSent = -1;
const videoStats: any = [];
let localStream: MediaStreamTrack;

// Open the camera in 720p to get a correct measurement of ramp-up time.
const constraints = {
  audio: false,
  video: {
    width: { exact: 1280 },
    height: { exact: 720 },
  },
};

const runBandwidthTestVideoBandwidth = async (config: RTCConfiguration) => {
  debug('runBandwidthTestVideoBandwidth()');
  callClass = new Call(config);
  callClass.setIceCandidateFilter(callClass.isRelay);
  // FEC makes it hard to study bandwidth estimation since there seems to be
  // a spike when it is enabled and disabled. Disable it for now. FEC issue
  // tracked on: https://code.google.com/p/webrtc/issues/detail?id=3050
  await callClass.disableVideoFec();
  await callClass.constrainVideoBitrate(maxVideoBitrateKbps);
  const stream = await doGetUserMedia(constraints);
  await gotStream(stream);
};

const gotStream = async (stream: MediaStream) => {
  debug('gotStream()');
  // await callClass.pc1.addStream(stream);
  stream.getTracks().forEach(async track => {
    await callClass.pc1.addTrack(track, stream);
  });
  await callClass.establishConnection();
  startTime = Date.now();
  localStream = stream.getVideoTracks()[0];
  setTimeout(gatherStats, statStepMs);
};

const gatherStats = async () => {
  debug('gatherStats()');
  const now = Date.now();
  if (now - startTime > durationMs) {
    // setProgress(100);
    await hangup();
    return;
  }
  if (!callClass.statsGatheringRunning) {
    await callClass.gatherStats(callClass.pc1, callClass.pc2, localStream, gotStats);
  }
  // setProgress(((now - this.startTime) * 100) / this.durationMs);
  setTimeout(gatherStats, statStepMs);
};

const gotStats = (response: any, time: any, response2: any, time2: any) => {
  debug('gotStats()');
  // TODO: Remove browser specific stats gathering hack once adapter.js or
  // browsers converge on a standard.
  let bitrateMean;
  let framerateMean;
  let bitrateStdDev;
  if (adapter.browserDetails.browser === 'chrome') {
    for (const i in response) {
      if (typeof response[i].connection !== 'undefined') {
        bweStats.add(
          response[i].connection.timestamp,
          parseInt(response[i].connection.availableOutgoingBitrate, 10),
        );
        rttStats.add(
          response[i].connection.timestamp,
          response[i].connection.currentRoundTripTime * 1000,
        );
        // Grab the last stats.
        videoStats[0] = response[i].video.local.frameWidth;
        videoStats[1] = response[i].video.local.frameHeight;
        nackCount = response[i].video.local.nackCount;
        packetsLost = response2[i].video.remote.packetsLost;
        qpSum = response2[i].video.remote.qpSum;
        pliCount = response[i].video.local.pliCount;
        packetsSent = response[i].video.local.packetsSent;
        packetsReceived = response2[i].video.remote.packetsReceived;
        framesEncoded = response[i].video.local.framesEncoded;
        framesDecoded = response2[i].video.remote.framesDecoded;
      }
    }
  } else if (adapter.browserDetails.browser === 'firefox') {
    for (const j in response) {
      if (response[j].id === 'outbound_rtcp_video_0') {
        rttStats.add(Date.parse(response[j].timestamp), parseInt(response[j].mozRtt, 10));
        // Grab the last stats.
        // const { jitter } = response[j];
        packetsLost = response[j].packetsLost;
      } else if (response[j].id === 'outbound_rtp_video_0') {
        // TODO: Get dimensions from getStats when supported in FF.
        videoStats[0] = 'Not supported on Firefox';
        videoStats[1] = 'Not supported on Firefox';
        bitrateMean = response[j].bitrateMean;
        bitrateStdDev = response[j].bitrateStdDev;
        framerateMean = response[j].framerateMean;
      }
    }
  } else {
    report(TestEvent.MESSAGE, [
      'videoBandwidth',
      `[ FAILED ] Only Firefox and Chrome getStats implementations are supported.`,
    ]);
  }

  // TODO: Remove browser specific stats gathering hack once adapter.js or
  // browsers converge on a standard.
  if (adapter.browserDetails.browser === 'chrome') {
    // Checking if greater than 2 because Chrome sometimes reports 2x2 when
    // a camera starts but fails to deliver frames.
    if (videoStats[0] < 2 && videoStats[1] < 2) {
      report(TestEvent.MESSAGE, [
        'videoBandwidth',
        `[ FAILED ] Camera failure: ${videoStats[0]}x${videoStats[1]}. Cannot test bandwidth without a working camera.`,
      ]);
    } else {
      report(TestEvent.MESSAGE, [
        'videoBandwidth',
        `[ OK ] Video resolution: ${videoStats[0]}x${videoStats[1]}`,
      ]);
      report(TestEvent.MESSAGE, [
        'videoBandwidth',
        `[ INFO ] Send bandwidth estimate average: ${Math.round(
          bweStats.getAverage() / 1000,
        )} kbps`,
      ]);
      report(TestEvent.MESSAGE, [
        'videoBandwidth',
        `[ INFO ] Send bandwidth estimate max: ${bweStats.getMax() / 1000} kbps`,
      ]);
      report(TestEvent.MESSAGE, [
        'videoBandwidth',
        `[ INFO ] Send bandwidth ramp-up time: ${bweStats.getRampUpTime()} ms`,
      ]);

      report(TestEvent.MESSAGE, ['videoBandwidth', `[ INFO ] Packets sent: ${packetsSent}`]);
      report(TestEvent.MESSAGE, [
        'videoBandwidth',
        `[ INFO ] Packets received: ${packetsReceived}`,
      ]);
      report(TestEvent.MESSAGE, ['videoBandwidth', `[ INFO ] NACK count: ${nackCount}`]);
      report(TestEvent.MESSAGE, [
        'videoBandwidth',
        `[ INFO ] Picture loss indications: ${pliCount}`,
      ]);
      report(TestEvent.MESSAGE, ['videoBandwidth', `[ INFO ] Quality predictor sum: ${qpSum}`]);
      report(TestEvent.MESSAGE, ['videoBandwidth', `[ INFO ] Frames encoded: ${framesEncoded}`]);
      report(TestEvent.MESSAGE, ['videoBandwidth', `[ INFO ] Frames decoded: ${framesDecoded}`]);
    }
  } else if (adapter.browserDetails.browser === 'firefox') {
    if (parseInt(framerateMean, 10) > 0) {
      report(TestEvent.MESSAGE, [
        'videoBandwidth',
        `[ OK ] Frame rate mean: ${parseInt(framerateMean, 10)}`,
      ]);
    } else {
      report(TestEvent.MESSAGE, [
        'videoBandwidth',
        `[ FAILED ] Frame rate mean is 0, cannot test bandwidth without a working camera.`,
      ]);
    }
    report(TestEvent.MESSAGE, [
      'videoBandwidth',
      `[ INFO ] Send bitrate mean: ${parseInt(bitrateMean, 10) / 1000} kbps`,
    ]);
    report(TestEvent.MESSAGE, [
      'videoBandwidth',
      `[ INFO ] Send bitrate standard deviation: ${parseInt(bitrateStdDev, 10) / 1000} kbps`,
    ]);
  }
  report(TestEvent.MESSAGE, [
    'videoBandwidth',
    `[ INFO ] RTT average: ${rttStats.getAverage()} ms`,
  ]);
  report(TestEvent.MESSAGE, ['videoBandwidth', `[ INFO ] RTT max: ${rttStats.getMax()} ms`]);
  report(TestEvent.MESSAGE, ['videoBandwidth', `[ INFO ] Packets lost: ${packetsLost}`]);
  report(TestEvent.END, ['videoBandwidth', 'success']);
  videoBandwidthPassed = true;
};

const hangup = async () => {
  debug('hangup()');
  // await callClass.pc1
  //   .getLocalStreams()[0]
  //   .getTracks()
  //   .forEach((track: any) => {
  //     track.stop();
  //   });
  await callClass.close();
  // callClass = null;
};

const sleep = (time: number): Promise<void> => {
  return new Promise(async (resolve, reject) => {
    setTimeout(() => resolve(), time);
  });
};

const runBandwidthTests = async (callback: TestEventCallback): Promise<boolean> => {
  console.log('Bandwidth tests started');

  await sleep(1000);
  debug(Date.now());
  // Set up a datachannel between two peers through a relay
  // and verify data can be transmitted and received
  // (packets travel through the public internet)
  await initBandwidthTestThroughput(callback);
  await sleep(15_000);
  debug(Date.now());
  // Set up a datachannel between two peers through a public IP address
  // and verify data can be transmitted and received
  // (packets should stay on the link if behind a router doing NAT)
  await initBandwidthTestVideoBandwidth(callback);
  await sleep(15_000);

  // Uncomment when testing
  // callback(TestEvent.START, 'throughput');
  // await sleep(2000);
  // callback(TestEvent.END, ['throughput', 'success']);
  // await sleep(1000);
  // callback(TestEvent.START, 'videoBandwidth');
  // await sleep(2000);
  // callback(TestEvent.END, ['videoBandwidth', 'success']);

  let failure = false;
  setTimeout(() => {
    // Disable report function for other running code
    report = () => {};
    if (!throughputPassed) {
      callback(TestEvent.END, ['throughput', 'failure']);
      callback(TestEvent.MESSAGE, ['throughput', `[ FAILED ] Timed out`]);
    }
    if (!videoBandwidthPassed) {
      callback(TestEvent.END, ['videoBandwidth', 'failure']);
      callback(TestEvent.MESSAGE, ['videoBandwidth', `[ FAILED ] Timed out`]);
    }
    failure = !throughputPassed || !videoBandwidthPassed;
  }, 1 * 60 * 1000);
  await sleep(1 * 60 * 1000);

  // XXX: Tests could still be running in the background although they are timed out
  console.log('Bandwidth tests done');

  return !failure;
};

export default runBandwidthTests;
