const { RTCPeerConnection } = require('wrtc')
import Monitor from './lib-call-quality-monitoring'
// We are going to mock API: https://jestjs.io/docs/en/es6-class-mocks
// import API from './utils/API';
// jest.mock('./utils/API');

describe('Monitor Test', () => {
  it('works if true is truthy', () => {
    expect(true).toBeTruthy()
  })

  it('Monitor is instantiable', () => {
    const monitor = new Monitor({ backendUrl: 'https://meetrix.io' })
    expect(monitor).toBeInstanceOf(Monitor)
    // expect(API).toHaveBeenCalledTimes(1);
  })

  it('Add peer to Monitor', async () => {
    const monitor = new Monitor({ backendUrl: 'http://localhost:9100/v1/stats/peer' })
    const pc1 = new RTCPeerConnection()
    const pc2 = new RTCPeerConnection()
    monitor.addPeer({ pc: pc1, peerId: 'pc1' })

    const offer = await pc1.createOffer()
    pc1.setLocalDescription(offer)
    pc2.setRemoteDescription(offer)
    const answer = await pc2.createAnswer()
    pc2.setLocalDescription(answer)
    pc1.setRemoteDescription(answer)

    console.log(offer)
    monitor.addPeer({ pc: pc2, peerId: 'pc2' })
    return new Promise(resolve => {
      setTimeout(() => {
        resolve()
      }, 5000)
    })
  })
})
