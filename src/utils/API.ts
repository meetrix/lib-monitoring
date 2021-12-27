import io, { Socket, SocketOptions, ManagerOptions } from 'socket.io-client'
import { BACKEND_URL, SOCKET_PATH } from '../config'
import { Report } from '../types'

export interface ApiOptions {
  token: string
  options?: SocketOptions & ManagerOptions
}

export default class API {
  socket?: Socket

  constructor({ token, options }: ApiOptions) {
    this.socket = io(BACKEND_URL, {
      path: SOCKET_PATH,
      auth: {
        token
      },
      ...options
    })
  }

  async report(event: Report) {
    try {
      if (this.socket) {
        this.socket?.emit('report', event)
      }
    } catch (error) {
      console.error('Meetrix:callQualityMonitor:', error)
    }
  }
}
