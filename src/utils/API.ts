
import axios from 'axios';
import type { TimelineEvent } from '@peermetrics/webrtc-stats';

export default class API {
  backendUrl: string;

  constructor(backendUrl: string) {
    this.backendUrl = backendUrl;
  }

  async report(event: TimelineEvent) {
    try {
      const response = await axios.post(this.backendUrl, event);
    } catch (error) {
      console.error('Meetrix:callQualityMonitor:', error);
    }
  }
}
