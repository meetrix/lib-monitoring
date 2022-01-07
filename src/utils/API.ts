import io, { Socket, SocketOptions, ManagerOptions } from 'socket.io-client'
import { TimelineEvent } from '@peermetrics/webrtc-stats'
import { BACKEND_URL, SOCKET_PATH } from '../config'
import { Report } from '@meetrix/webrtc-monitoring-common-lib'

export interface ApiOptions {
  token: string
  clientId: string
  options?: SocketOptions & ManagerOptions
}

export default class API {
  socket?: Socket

  constructor({ token, clientId, options }: ApiOptions) {
    this.socket = io(BACKEND_URL, {
      path: SOCKET_PATH,
      auth: {
        token
      },
      query: {
        clientId
      },
      ...options
    })
  }

  async report(report: Report) {
    try {
      if (this.socket) {
        const customReport = report.data

        this.socket?.emit(report.event, report)
      }
    } catch (error) {
      console.error('Meetrix:callQualityMonitor:', error)
    }
  }
}
