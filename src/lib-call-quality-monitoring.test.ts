import { RTCPeerConnection } from 'wrtc'
import Monitor from './lib-call-quality-monitoring'

/**
 * Dummy test
 */
describe('Monitor Test', () => {
  it('works if true is truthy', () => {
    expect(true).toBeTruthy()
  })

  it('Monitor is instantiable', () => {
    expect(new Monitor({ backendUrl: 'https://meetrix.io' })).toBeInstanceOf(Monitor)
  })

  it('Add peer to Monitor', () => {
    const monitor = new Monitor({ backendUrl: 'https://meetrix.io' })
    monitor.addPeer({
      pc: new RTCPeerConnection(),
      peerId: '1234'
    })
  })
})
