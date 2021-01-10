const { RTCPeerConnection } = require('wrtc')
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

  it('Add peer to Monitor', async () => {
    const monitor = new Monitor({ backendUrl: 'https://meetrix.io' })
    const pc1 = new RTCPeerConnection()
    const pc2 = new RTCPeerConnection()
    monitor.addPeer({ pc: pc1, peerId: 'pc1' })
    monitor.addPeer({ pc: pc2, peerId: 'pc2' })

    const sdp1 = await pc1.createOffer()
    console.log(sdp1)
  })
})
