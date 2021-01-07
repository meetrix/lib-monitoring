export interface MonitoringConstructorOptions {
  backendUrl: string,

}

export interface AddPeerOptions {
  pc: RTCPeerConnection
  peerId: string
}
