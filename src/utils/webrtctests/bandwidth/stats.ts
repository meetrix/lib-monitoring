/*
 *  Copyright (c) 2014 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */
class StatisticsAggregate {
  startTime_: number;

  sum_: number;

  count_: number;

  max_: number;

  rampUpThreshold_: number;

  rampUpTime_: number;

  constructor(rampUpThreshold: number) {
    this.startTime_ = 0;
    this.sum_ = 0;
    this.count_ = 0;
    this.max_ = 0;
    this.rampUpThreshold_ = rampUpThreshold;
    this.rampUpTime_ = Infinity;
  }

  add = (time: number, datapoint: number): void => {
    if (this.startTime_ === 0) {
      this.startTime_ = time;
    }
    this.sum_ += datapoint;
    this.max_ = Math.max(this.max_, datapoint);
    if (this.rampUpTime_ === Infinity && datapoint > this.rampUpThreshold_) {
      this.rampUpTime_ = time;
    }
    this.count_ += 1;
  };

  getAverage = (): number => {
    if (this.count_ === 0) {
      return 0;
    }
    return Math.round(this.sum_ / this.count_);
  };

  getMax = (): number => {
    return this.max_;
  };

  getRampUpTime = (): number => {
    return Math.round(this.rampUpTime_ - this.startTime_);
  };
}

export default StatisticsAggregate;
