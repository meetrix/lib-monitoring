import io, { Socket, SocketOptions, ManagerOptions } from 'socket.io-client'
import { BACKEND_URL, SOCKET_PATH } from '../config'
import { Report, Other, Connection } from '@meetrix/webrtc-monitoring-common-lib'

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
        this.socket?.emit(report.event, report)
      }
    } catch (error) {
      console.error('Meetrix:callQualityMonitor:', error)
    }
  }

  async connectionStats(connectionInfo: Connection) {
    try {
      if (this.socket) {
        this.socket?.emit('connectionInfo', connectionInfo)
      }
    } catch (error) {
      console.error('Meetrix:callQualityMonitor:', error)
    }
  }

  async other(other: Other) {
    try {
      if (this.socket) {
        this.socket?.emit('other', other)
      }
    } catch (error) {
      console.error('Meetrix:callQualityMonitor:', error)
    }
  }
}
