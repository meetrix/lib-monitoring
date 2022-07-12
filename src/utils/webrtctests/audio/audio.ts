/* eslint-disable no-async-promise-executor */
/* eslint-disable @typescript-eslint/no-explicit-any */
/*
 *  Copyright (c) 2014 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */

import Debug from 'debug';

import { doGetUserMedia, setTimeoutWithProgressBar } from '../../testUtil';
import { TestEvent, TestEventCallback } from '../TestEvent';

const debug = Debug('audioTest');

const inputChannelCount = 6;
const outputChannelCount = 2;
// Buffer size set to 0 to let Chrome choose based on the platform.
const bufferSize = 0;
// Turning off echoCancellation constraint enables stereo input.
const constraints = {
  audio: {
    echoCancellation: false,
  },
};

const collectSeconds = 2.0;
// At least one LSB 16-bit data (compare is on absolute value).
const silentThreshold = 1.0 / 32767;
const lowVolumeThreshold = -60;
// Data must be identical within one LSB 16-bit to be identified as mono.
const monoDetectThreshold = 1.0 / 65536;
// Number of consecutive clipThreshold level samples that indicate clipping.
const clipCountThreshold = 6;
const clipThreshold = 1.0;

// Populated with audio as a 3-dimensional array:
//   collectedAudio[channels][buffers][samples]
const collectedAudio: string | any[] = [];
let collectedSampleCount = 0;
for (let i = 0; i < inputChannelCount; i += 1) {
  collectedAudio[i] = [];
}
// const AudioContext = window.AudioContext || window.webkitAudioContext;
const { AudioContext } = window;
let audioContext: AudioContext;
const getAudioContext = () => {
  if (!audioContext) {
    audioContext = new AudioContext();
  }

  return audioContext;
};
let aStream: any;
let audioSource: any;
let scriptNode: any;
let report: TestEventCallback;

const runMicTest = async (callback: TestEventCallback): Promise<boolean> => {
  // Resuming as per new spec after user interaction.
  report = callback;
  report(TestEvent.START, '');

  try {
    await getAudioContext().resume();
    aStream = await doGetUserMedia(constraints);
    await gotStream();
  } catch (error) {
    report(TestEvent.MESSAGE, `WebAudio run failure: ${error}`);
    report(TestEvent.END, 'failure');
    return false;
  }

  return true;
};

const gotStream = async () => {
  if (!(await checkAudioTracks())) {
    debug('failure');
    report(TestEvent.END, 'failure');
    return;
  }
  await createAudioBuffer();
};

const checkAudioTracks = async () => {
  const audioTracks = await aStream.getAudioTracks();
  if (audioTracks.length < 1) {
    report(TestEvent.MESSAGE, '[ FAILED ] No audio track in returned stream.');
    return false;
  }
  report(TestEvent.MESSAGE, `[ OK ] Audio track created using device=${audioTracks[0].label}`);
  return true;
};

const createAudioBuffer = async () => {
  debug('createAudioBuffer()');
  audioSource = await getAudioContext().createMediaStreamSource(aStream);
  scriptNode = await getAudioContext().createScriptProcessor(
    bufferSize,
    inputChannelCount,
    outputChannelCount,
  );
  await audioSource.connect(scriptNode);
  await scriptNode.connect(getAudioContext().destination);
  scriptNode.onaudioprocess = collectAudio;
  await setTimeoutWithProgressBar(5000);
  await onStopCollectingAudio();

  // stopCollectingAudio = setTimeoutWithProgressBar(
  //   onStopCollectingAudio.bind(this),
  //   5000
  // );
};

const collectAudio = async (event: {
  inputBuffer: {
    length: any;
    numberOfChannels: number;
    getChannelData: (arg0: number) => any;
    sampleRate: number;
  };
}) => {
  debug('collectAudio()');
  // Simple silence detection: check first and last sample of each channel in
  // the buffer. If both are below a threshold, the buffer is considered
  // silent.
  const sampleCount = event.inputBuffer.length;
  let allSilent = true;
  for (let c = 0; c < event.inputBuffer.numberOfChannels; c += 1) {
    const data = event.inputBuffer.getChannelData(c);
    const first = Math.abs(data[0]);
    const last = Math.abs(data[sampleCount - 1]);
    let newBuffer;
    if (first > silentThreshold || last > silentThreshold) {
      // Non-silent buffers are copied for analysis. Note that the silent
      // detection will likely cause the stored stream to contain discontinu-
      // ities, but that is ok for our needs here (just looking at levels).
      newBuffer = new Float32Array(sampleCount);
      newBuffer.set(data);
      allSilent = false;
    } else {
      // Silent buffers are not copied, but we store empty buffers so that the
      // analysis doesn't have to care.
      newBuffer = new Float32Array();
    }
    collectedAudio[c].push(newBuffer);
  }
  if (!allSilent) {
    collectedSampleCount += sampleCount;
    if (collectedSampleCount / event.inputBuffer.sampleRate >= collectSeconds) {
      // onStopCollectingAudio();
    }
  }
};

const onStopCollectingAudio = async () => {
  debug('onStopCollectingAudio()');
  await aStream.getAudioTracks()[0].stop();
  await audioSource.disconnect(scriptNode);
  await scriptNode.disconnect(getAudioContext().destination);
  await analyzeAudio(collectedAudio);
  report(TestEvent.END, 'success');
};

const analyzeAudio = (channels: string | any[]) => {
  debug('analyzeAudio()');
  const activeChannels = [];
  for (let c = 0; c < channels.length; c += 1) {
    if (channelStats(c, channels[c])) {
      activeChannels.push(c);
    }
  }
  if (activeChannels.length === 0) {
    report(
      TestEvent.MESSAGE,
      '[ FAILED ] No active input channels detected. Microphone ' +
        'is most likely muted or broken, please check if muted in the ' +
        'sound settings or physically on the device. Then rerun the test.',
    );
  } else {
    report(TestEvent.MESSAGE, `[ OK ] Active audio input channels: ${activeChannels.length}`);
  }
  if (activeChannels.length === 2) {
    detectMono(channels[activeChannels[0]], channels[activeChannels[1]]);
  }
};

const channelStats = (channelNumber: any, buffers: string | any[]) => {
  debug('channelStats()');
  let maxPeak = 0.0;
  let maxRms = 0.0;
  let clipCount = 0;
  let maxClipCount = 0;
  for (let j = 0; j < buffers.length; j += 1) {
    const samples = buffers[j];
    if (samples.length > 0) {
      let s = 0;
      let rms = 0.0;
      for (let i = 0; i < samples.length; i += 1) {
        s = Math.abs(samples[i]);
        maxPeak = Math.max(maxPeak, s);
        rms += s * s;
        if (maxPeak >= clipThreshold) {
          clipCount += 1;
          maxClipCount = Math.max(maxClipCount, clipCount);
        } else {
          clipCount = 0;
        }
      }
      // RMS is calculated over each buffer, meaning the integration time will
      // be different depending on sample rate and buffer size. In practice
      // this should be a small problem.
      rms = Math.sqrt(rms / samples.length);
      maxRms = Math.max(maxRms, rms);
    }
  }

  if (maxPeak > silentThreshold) {
    const dBPeak = dBFS(maxPeak);
    const dBRms = dBFS(maxRms);
    report(
      TestEvent.MESSAGE,
      `[ INFO ] Channel ${channelNumber} levels: ${dBPeak.toFixed(1)} dB (peak), ${dBRms.toFixed(
        1,
      )} dB (RMS)`,
    );
    if (dBRms < lowVolumeThreshold) {
      report(
        TestEvent.MESSAGE,
        '[ FAILED ] Microphone input level is low, increase input ' +
          'volume or move closer to the microphone.',
      );
    }
    if (maxClipCount > clipCountThreshold) {
      report(
        TestEvent.MESSAGE,
        '[ WARN ] Clipping detected! Microphone input level ' +
          'is high. Decrease input volume or move away from the microphone.',
      );
    }
    return true;
  }
  return false;
};

const detectMono = (buffersL: string | any[], buffersR: any[]) => {
  debug('detectMono()');
  let diffSamples = 0;
  for (let j = 0; j < buffersL.length; j += 1) {
    const l = buffersL[j];
    const r = buffersR[j];
    if (l.length === r.length) {
      let d = 0.0;
      for (let i = 0; i < l.length; i += 1) {
        d = Math.abs(l[i] - r[i]);
        if (d > monoDetectThreshold) {
          diffSamples += 1;
        }
      }
    } else {
      diffSamples += 1;
    }
  }
  if (diffSamples > 0) {
    report(TestEvent.MESSAGE, '[ INFO ] Stereo microphone detected.');
  } else {
    report(TestEvent.MESSAGE, '[ INFO ] Mono microphone detected.');
  }
};

const dBFS = (gain: number) => {
  const dB = (20 * Math.log(gain)) / Math.log(10);
  // Use Math.round to display up to one decimal place.
  return Math.round(dB * 10) / 10;
};

export default runMicTest;
