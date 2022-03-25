/*
 *  Copyright (c) 2017 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */

import Ssim from './ssim';

interface IFrameStats {
  numFrozenFrames: number;
  numBlackFrames: number;
  numFrames: number;
}

class VideoFrameChecker {
  frameStats: IFrameStats;

  running_: boolean;

  nonBlackPixelLumaThreshold: number;

  previousFrame_: Uint8ClampedArray;

  identicalFrameSsimThreshold: number;

  frameComparator: Ssim;

  canvas_: HTMLCanvasElement;

  videoElement_: HTMLVideoElement;

  listener_: () => void;

  constructor(videoelement: HTMLVideoElement) {
    this.frameStats = {
      numFrozenFrames: 0,
      numBlackFrames: 0,
      numFrames: 0
    };

    this.running_ = true;

    this.nonBlackPixelLumaThreshold = 20;
    this.previousFrame_ = new Uint8ClampedArray();
    this.identicalFrameSsimThreshold = 0.985;
    this.frameComparator = new Ssim();

    this.canvas_ = document.createElement('canvas');
    this.videoElement_ = videoelement;
    this.listener_ = this.checkVideoFrame_.bind(this);
    this.videoElement_.addEventListener('play', this.listener_, false);
  }

  stop = (): void => {
    this.videoElement_.removeEventListener('play', this.listener_);
    this.running_ = false;
  };

  getCurrentImageData_ = (): ImageData | null => {
    this.canvas_.width = this.videoElement_.width;
    this.canvas_.height = this.videoElement_.height;

    const context = this.canvas_.getContext('2d');
    if (context) {
      context.drawImage(this.videoElement_, 0, 0, this.canvas_.width, this.canvas_.height);
      return context.getImageData(0, 0, this.canvas_.width, this.canvas_.height);
    }
    return null;
  };

  checkVideoFrame_ = (): void => {
    if (!this.running_) {
      return;
    }
    if (this.videoElement_.ended) {
      return;
    }

    const imageData = this.getCurrentImageData_();
    if (imageData) {
      if (this.isBlackFrame_(imageData.data, imageData.data.length)) {
        this.frameStats.numBlackFrames += 1;
      }

      if (
        this.frameComparator.calculate(this.previousFrame_, imageData.data) >
        this.identicalFrameSsimThreshold
      ) {
        this.frameStats.numFrozenFrames += 1;
      }
      this.previousFrame_ = imageData.data;

      this.frameStats.numFrames += 1;
      setTimeout(this.checkVideoFrame_.bind(this), 20);
    }
  };

  isBlackFrame_ = (data: Uint8ClampedArray, length: number): boolean => {
    // TODO: Use a statistical, histogram-based detection.
    const thresh = this.nonBlackPixelLumaThreshold;
    let accuLuma = 0;
    for (let i = 4; i < length; i += 4) {
      // Use Luma as in Rec. 709: Y′709 = 0.21R + 0.72G + 0.07B;
      accuLuma += 0.21 * data[i] + 0.72 * data[i + 1] + 0.07 * data[i + 2];
      // Early termination if the average Luma so far is bright enough.
      if (accuLuma > (thresh * i) / 4) {
        return false;
      }
    }
    return true;
  };
}

export default VideoFrameChecker;
