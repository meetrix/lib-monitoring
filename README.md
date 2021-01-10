# Meetrix Lib Call Quality

1. This project was bootstrapped with : [https://github.com/alexjoverm/typescript-library-starter.git]
2. Underlying peer metric library: [https://github.com/peermetrics/webrtc-stats]

## Adding global variables for testing

The tests run on `node` environment instead of the real browser environment. Because of that, some browser variables like `window`, WebRTC API are not available in test environment. Therefore, we have to setup them in `setup.jest.js`
