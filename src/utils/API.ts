import io, { Socket, SocketOptions, ManagerOptions } from 'socket.io-client';
import axios, { AxiosInstance } from 'axios';
import createAuthRefreshInterceptor from 'axios-auth-refresh';

import { Report } from '@meetrix/webrtc-monitoring-common-lib';
import { TimelineEvent } from '@peermetrics/webrtc-stats';
import debugLib from 'debug';

import { SOCKET_PATH } from '../config';

const debug = debugLib('localStorageUtils:');
debug.enabled = true;

export interface ApiOptions {
  token: string;
  clientId: string;
  baseUrl: string;
  options?: SocketOptions & ManagerOptions;
}

export const getMediaInfo = async () => {
  const browserInfo = { userAgent: navigator.userAgent, platform: navigator.platform };
  const mediaDeviceInfo = await navigator.mediaDevices.enumerateDevices();
  return {
    event: 'mediaInfo',
    tag: 'getUserMedia',
    timestamp: new Date(),
    data: { browserInfo, mediaDeviceInfo },
  };
};

export default class API {
  public static default: API;

  socket?: Socket;
  rest?: AxiosInstance;
  jwt?: string;

  constructor({ token, clientId, baseUrl, options }: ApiOptions) {
    const backendWs = `${baseUrl}/clients`;
    const backendRest = `${baseUrl}/v1`;

    this.socket = io(backendWs, {
      path: SOCKET_PATH,
      auth: {
        token,
      },
      query: {
        clientId,
      },
      ...options,
    });

    //send mediainfo on connection establishment and periodically
    const sendMediaInfo = async () => {
      try {
        if (this.socket) {
          const mediaInfo = await getMediaInfo();
          this.socket?.emit(mediaInfo.event, mediaInfo);
        }
      } catch (error) {
        debug('Meetrix:callQualityMonitor:', error);
      }
    };

    this.socket.on('connect', sendMediaInfo);
    this.socket.io.on('ping', sendMediaInfo);

    this.rest = axios.create({
      baseURL: backendRest,
      headers: {
        'X-Client-Id': clientId,
        'Content-Type': 'application/json',
      },
    });

    createAuthRefreshInterceptor(this.rest, async failedRequest => {
      const tokenRefreshResponse = await axios.post(`${backendRest}/plugins/${token}/token`);
      this.jwt = tokenRefreshResponse.data;
      failedRequest.response.config.headers.Authorization = `Bearer ${tokenRefreshResponse.data.token}`;
      return Promise.resolve();
    });

    axios.interceptors.request.use(request => {
      if (request.headers && this.jwt) {
        request.headers.Authorization = `Bearer ${this.jwt}`;
      }
      return request;
    });

    this.rest.interceptors.response.use(
      response => {
        return response.data;
      },
      error => {
        if (error.response) {
          return Promise.reject(error.response.data);
        }
        return Promise.reject(error);
      },
    );

    API.default = this;
  }

  async report(report: Report) {
    try {
      if (this.socket) {
        this.socket?.emit(report.event, report);
      }
    } catch (error) {
      debug('Meetrix:callQualityMonitor:', error);
    }
  }

  async connectionStats(connectionInfo: TimelineEvent) {
    try {
      if (this.socket) {
        this.socket?.emit('connectionInfo', connectionInfo);
      }
    } catch (error) {
      debug('Meetrix:callQualityMonitor:', error);
    }
  }

  async otherStats(otherInfo: TimelineEvent) {
    try {
      if (this.socket) {
        this.socket?.emit('otherInfo', otherInfo);
      }
    } catch (error) {
      debug('Meetrix:callQualityMonitor:', error);
    }
  }
}
