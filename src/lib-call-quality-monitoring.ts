// Import here Polyfills if needed. Recommended core-js (npm i -D core-js)
// import "core-js/fn/array.find"
// ...
import { AddPeerOptions, TimelineEvent, WebRTCStats } from '@peermetrics/webrtc-stats';
import { nanoid } from 'nanoid';
import debugLib from 'debug';

import { EventTypes, MonitoringConstructorOptions } from './types';
import API from './utils/API';
import { getReportFromTimelineEvent, handleReport } from './utils/localReport';
import { getClientId, setClientId } from './utils/localStorageUtils';
import { getUrlParams } from './utils/urlUtils';
import { mountUI, updateUI } from './ui';
import {
  testBrowser,
  testCamera,
  TestEventCallback,
  testMicrophone,
  testNetwork,
} from './utils/webrtctests';

import { BACKEND_URL } from './config';

const debug = debugLib('localStorageUtils:');
debug.enabled = true;

export default class Monitor {
  stats: WebRTCStats;
  api: API | undefined;
  clientId: string;

  constructor(options: MonitoringConstructorOptions) {
    const { token: _token, clientId: _clientId, baseUrl = BACKEND_URL } = options || {};
    // allow overriding via url parameters
    const { clientId: urlClientId, token: urlToken } = getUrlParams();
    const clientId = urlClientId || _clientId || getClientId();
    const token = urlToken || _token;
    if (clientId) {
      this.clientId = clientId;
    } else {
      // if there is no client id, use a random value
      const newClientId = nanoid();
      setClientId(newClientId);
      this.clientId = newClientId;
    }
    this.api = token ? new API({ token, clientId: this.clientId, baseUrl }) : undefined;
    this.stats = new WebRTCStats({
      getStatsInterval: 5000,
      rawStats: true,
      statsObject: false,
      filteredStats: false,
      wrapGetUserMedia: true,
      debug: false,
      remote: false,
      logLevel: 'error',
    });
    const events: EventTypes[] = [
      'timeline',
      //'stats',
      //'getUserMedia',
      //'peer',
      //'track',
      //'connection',
      //'datachannel'
    ];

    getClientId();

    events.forEach(eventType => {
      this.stats.on(eventType, async (event: TimelineEvent) => {
        if (event.event === 'stats' && event.data.outbound) {
          for (let stream of event.data.outbound) {
            if (stream.kind == 'video') {
              // if (stream.qualityLimitationReason != 'null') {
              const report = await getReportFromTimelineEvent(event);
              debug('---- stats ----', report);
              if (this.api) {
                this.api.report(report);
              }
              handleReport(report);
              // }
              break;
            }
          }
        } else if (event.event === 'onconnectionstatechange') {
          debug('---- onconnectionstatechange ----', event);
          if (this.api) {
            this.api.connectionStats(event);
          }
        } else {
          debug('---- other ----', event);
          if (this.api) {
            this.api.otherStats(event);
          }
        }
      });
    });
  }

  testBrowser(callback: TestEventCallback) {
    testBrowser(callback);
  }

  testCamera(callback: TestEventCallback) {
    testCamera(callback);
  }

  testMicrophone(callback: TestEventCallback) {
    testMicrophone(callback);
  }

  testNetwork(callback: TestEventCallback) {
    testNetwork(callback);
  }

  addPeer(addPeerOptions: AddPeerOptions) {
    this.stats.addPeer(addPeerOptions);
    // addPeerConnected({ peerId: options.peerId })
  }

  UI() {
    mountUI();
    updateUI();
  }
}
