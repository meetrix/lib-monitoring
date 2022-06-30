/* eslint-disable no-async-promise-executor */
/* eslint-disable no-prototype-builtins */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-plusplus */
/* eslint-disable prefer-destructuring */
/* eslint-disable @typescript-eslint/no-explicit-any */
/*
 *  Copyright (c) 2014 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */

/*
 * In generic cameras using Chrome rescaler, all resolutions should be supported
 * up to a given one and none beyond there. Special cameras, such as digitizers,
 * might support only one resolution.
 */

/*
 * "Analyze performance for "resolution"" test uses getStats, canvas and the
 * video element to analyze the video frames from a capture device. It will
 * report number of black frames, frozen frames, tested frames and various stats
 * like average encode time and FPS. A test case will be created per mandatory
 * resolution found in the "resolutions" array.
 */

import Debug from 'debug';
import {
  arrayAverage,
  arrayMax,
  arrayMin,
  doGetUserMedia,
  setTimeoutWithProgressBar,
} from '../../testUtil';
import Call from '../../call';
import VideoFrameChecker from './videoframechecker';
import { TestEvent, TestEventCallback } from '../TestEvent';

const debug = Debug('videoTest');

let resolutions: number[][];
let resolutionSuccessStatus: boolean[];
let currentResolution = 0;
let isMuted = false;
let isShuttingDown = false;
let aStream: MediaStream;
let type: string;

let report: TestEventCallback;

const initVideoTest = async (
  callback: TestEventCallback,
  resolutionsArg: number[][],
  typeArg: string,
): Promise<boolean> => {
  resolutions = resolutionsArg;
  resolutionSuccessStatus = new Array(resolutions.length).fill(true);
  type = typeArg;
  report = callback;
  currentResolution = 0;
  isMuted = false;
  isShuttingDown = false;
  callback(TestEvent.START, type);
  await runVideoTest(resolutions[0]);

  return resolutionSuccessStatus.every(Boolean);
};

const runVideoTest = async (resolution: number[]) => {
  // Resuming as per new spec after user interaction.

  const constraints = {
    audio: false,
    video: {
      width: { exact: resolution[0] },
      height: { exact: resolution[1] },
    },
  };
  try {
    aStream = await doGetUserMedia(constraints);

    if (resolutions.length > 1) {
      report(TestEvent.MESSAGE, [type, `[ OK ] Supported: ${resolution[0]}x${resolution[1]}`]);
      aStream.getTracks().forEach((track: any) => {
        track.stop();
      });
      await maybeContinueGetUserMedia();
    } else {
      await collectAndAnalyzeStats_(resolution);
    }
  } catch (error) {
    resolutionSuccessStatus[currentResolution] = false;
    if (resolutions.length > 1) {
      report(TestEvent.MESSAGE, [type, `[ INFO ] ${resolution[0]}x${resolution[1]} not supported`]);
    } else {
      report(TestEvent.MESSAGE, [type, `[ FAILED ] getUserMedia failed with error: ${error}`]);
    }
    await maybeContinueGetUserMedia();
  }
};

const maybeContinueGetUserMedia = async () => {
  if (currentResolution === resolutions.length) {
    report(TestEvent.END, [type, resolutionSuccessStatus.every(Boolean) ? 'success' : 'failure']);
    return;
  }
  await runVideoTest(resolutions[currentResolution++]);
};

const collectAndAnalyzeStats_ = async (resolution: number[]) => {
  debug('collectAndAnalyzeStats_()');
  const tracks = aStream.getVideoTracks();
  if (tracks.length < 1) {
    report(TestEvent.MESSAGE, [type, '[ FAILED ] No video track in returned stream.']);
    await maybeContinueGetUserMedia();
    return;
  }

  // Firefox does not support event handlers on mediaStreamTrack yet.
  // https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamTrack
  // TODO: remove if (...) when event handlers are supported by Firefox.
  const videoTrack = tracks[0];
  if (typeof videoTrack.addEventListener === 'function') {
    // Register events.
    videoTrack.addEventListener('ended', () => {
      // Ignore events when shutting down the test.
      if (isShuttingDown) {
        return;
      }
      report(TestEvent.MESSAGE, [type, '[ FAILED ] Video track ended, camera stopped working']);
    });
    videoTrack.addEventListener('mute', () => {
      // Ignore events when shutting down the test.
      if (isShuttingDown) {
        return;
      }
      report(TestEvent.MESSAGE, [type, '[ WARN ] Your camera reported itself as muted.']);
      // MediaStreamTrack.muted property is not wired up in Chrome yet,
      // checking isMuted local state.
      isMuted = true;
    });
    videoTrack.addEventListener('unmute', () => {
      // Ignore events when shutting down the test.
      if (isShuttingDown) {
        return;
      }
      report(TestEvent.MESSAGE, [type, '[ INFO ] Your camera reported itself as unmuted.']);
      isMuted = false;
    });
  }

  const video = document.createElement('video');
  video.setAttribute('autoplay', '');
  video.setAttribute('muted', '');
  video.width = resolution[0];
  video.height = resolution[1];
  video.srcObject = aStream;
  const frameChecker = new VideoFrameChecker(video);
  const call = new Call({});
  aStream.getTracks().forEach(async track => {
    await call.pc1.addTrack(track, aStream);
  });
  await call.establishConnection();
  await call.gatherStats(
    call.pc1,
    call.pc2,
    aStream,
    onCallEnded_.bind(this, resolution, video, aStream, frameChecker),
  );

  await setTimeoutWithProgressBar(8000);
  await endCall_(call, aStream);
};

const onCallEnded_ = (
  resolution: any,
  videoElement: any,
  stream: any,
  frameChecker: any,
  stats: any,
  statsTime: any,
) => {
  debug('onCallEnded_()');
  analyzeStats_(resolution, videoElement, stream, frameChecker, stats, statsTime);

  frameChecker.stop();

  report(TestEvent.END, [type, 'success']);
};

const analyzeStats_ = (
  resolution: any,
  videoElement: any,
  stream: any,
  frameChecker: any,
  stats: any,
  statsTime: any,
) => {
  debug('analyzeStats_()');
  const googAvgEncodeTime = [];
  const googAvgFrameRateInput = [];
  const googAvgFrameRateSent = [];

  const { frameStats } = frameChecker;

  for (const index in stats) {
    if (stats[index].type === 'ssrc') {
      // Make sure to only capture stats after the encoder is setup.
      if (parseInt(stats[index].googFrameRateInput, 10) > 0) {
        googAvgEncodeTime.push(parseInt(stats[index].googAvgEncodeMs, 10));
        googAvgFrameRateInput.push(parseInt(stats[index].googFrameRateInput, 10));
        googAvgFrameRateSent.push(parseInt(stats[index].googFrameRateSent, 10));
      }
    }
  }
  const statsReport = {
    cameraName: stream.getVideoTracks()[0].label || NaN,
    actualVideoWidth: videoElement.videoWidth,
    actualVideoHeight: videoElement.videoHeight,
    mandatoryWidth: resolution[0],
    mandatoryHeight: resolution[1],
    encodeSetupTimeMs: extractEncoderSetupTime_(stats, statsTime),
    avgEncodeTimeMs: arrayAverage(googAvgEncodeTime),
    minEncodeTimeMs: arrayMin(googAvgEncodeTime),
    maxEncodeTimeMs: arrayMax(googAvgEncodeTime),
    avgInputFps: arrayAverage(googAvgFrameRateInput),
    minInputFps: arrayMin(googAvgFrameRateInput),
    maxInputFps: arrayMax(googAvgFrameRateInput),
    avgSentFps: arrayAverage(googAvgFrameRateSent),
    minSentFps: arrayMin(googAvgFrameRateSent),
    maxSentFps: arrayMax(googAvgFrameRateSent),
    isMuted,
    testedFrames: frameStats.numFrames,
    blackFrames: frameStats.numBlackFrames,
    frozenFrames: frameStats.numFrozenFrames,
  };

  // TODO: Add a reportInfo() function with a table format to display
  // values clearer.
  // report.traceEventInstant('video-stats', statsReport);

  testExpectations_(statsReport);
};

const endCall_ = async (callObject: any, stream: any) => {
  isShuttingDown = true;
  stream.getTracks().forEach((track: any) => {
    track.stop();
  });
  await callObject.close();
};

const extractEncoderSetupTime_ = (stats: any, statsTime: any) => {
  for (let index = 0; index !== stats.length; index++) {
    if (stats[index].type === 'ssrc') {
      if (parseInt(stats[index].googFrameRateInput, 10) > 0) {
        return JSON.stringify(statsTime[index] - statsTime[0]);
      }
    }
  }
  return NaN;
};

const resolutionMatchesIndependentOfRotationOrCrop_ = (
  aWidth: any,
  aHeight: any,
  bWidth: any,
  bHeight: any,
) => {
  const minRes = Math.min(bWidth, bHeight);
  return (
    (aWidth === bWidth && aHeight === bHeight) ||
    (aWidth === bHeight && aHeight === bWidth) ||
    (aWidth === minRes && bHeight === minRes)
  );
};

const testExpectations_ = (info: any) => {
  const notAvailableStats = [];
  for (const key in info) {
    if (info.hasOwnProperty(key)) {
      if (typeof info[key] === 'number' && Number.isNaN(info[key])) {
        notAvailableStats.push(key);
      } else {
        report(TestEvent.MESSAGE, [type, `[ INFO ] ${key}: ${info[key]}`]);
      }
    }
  }
  if (notAvailableStats.length !== 0) {
    report(TestEvent.MESSAGE, [type, `[ INFO ] Not available: ${notAvailableStats.join(', ')}`]);
  }

  if (Number.isNaN(info.avgSentFps)) {
    report(TestEvent.MESSAGE, [type, '[ INFO ] Cannot verify sent FPS.']);
  } else if (info.avgSentFps < 5) {
    report(TestEvent.MESSAGE, [type, `[ FAILED ] Low average sent FPS: ${info.avgSentFps}`]);
  } else {
    report(TestEvent.MESSAGE, [type, '[ OK ] Average FPS above threshold']);
  }
  if (
    !resolutionMatchesIndependentOfRotationOrCrop_(
      info.actualVideoWidth,
      info.actualVideoHeight,
      info.mandatoryWidth,
      info.mandatoryHeight,
    )
  ) {
    report(TestEvent.MESSAGE, [type, '[ FAILED ] Incorrect captured resolution.']);
  } else {
    report(TestEvent.MESSAGE, [type, '[ OK ] Captured video using expected resolution.']);
  }
  if (info.testedFrames === 0) {
    report(TestEvent.MESSAGE, [type, '[ FAILED ] Could not analyze any video frame.']);
  } else {
    if (info.blackFrames > info.testedFrames / 3) {
      report(TestEvent.MESSAGE, [type, '[ FAILED ] Camera delivering lots of black frames.']);
    }
    if (info.frozenFrames > info.testedFrames / 3) {
      report(TestEvent.MESSAGE, [type, '[ FAILED ] Camera delivering lots of frozen frames.']);
    }
  }
};

const sleep = (time: number): Promise<void> => {
  return new Promise(async (resolve, reject) => {
    setTimeout(() => resolve(), time);
  });
};

const runVideoTests = async (callback: TestEventCallback): Promise<boolean> => {
  await sleep(1000);
  debug(Date.now());
  const p240 = await initVideoTest(callback, [[320, 240]], 'p240');
  await sleep(5000);
  debug(Date.now());
  const p480 = await initVideoTest(callback, [[640, 480]], 'p480');
  await sleep(5000);
  debug(Date.now());
  const p720 = await initVideoTest(callback, [[1280, 720]], 'p720');
  await sleep(5000);
  debug(Date.now());
  // TODO: clarify: why are the above tests run separately, and why are they run again below?
  const generic = await initVideoTest(
    callback,
    [
      [160, 120],
      [320, 180],
      [320, 240],
      [640, 360],
      [640, 480],
      [768, 576],
      [1024, 576],
      [1280, 720],
      [1280, 768],
      [1280, 800],
      [1920, 1080],
      [1920, 1200],
      [3840, 2160],
      [4096, 2160],
    ],
    'generic',
  );
  await sleep(1000);
  debug(Date.now());

  const success = p240 && p480 && p720;
  if (success) {
    callback(TestEvent.MESSAGE, ['generic', `[ OK ] Mandatory conditions satisfied.`]);
  }
  return success; // generic omitted
};

export default runVideoTests;
