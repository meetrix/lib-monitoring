const { RTCPeerConnection } = require('wrtc');

(async function() {
  global.RTCPeerConnection = RTCPeerConnection;
  global.window = {
    setInterval,
  }
})();
