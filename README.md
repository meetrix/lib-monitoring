# Meetrix Lib Call Quality

1. This project was bootstrapped with : [https://github.com/alexjoverm/typescript-library-starter.git]
2. Underlying peer metric library: [https://github.com/peermetrics/webrtc-stats]

## Adding global variables for testing

The tests run on `node` environment instead of the real browser environment. Because of that, some browser variables like `window`, WebRTC API are not available in test environment. Therefore, we have to setup them in `setup.jest.js`

## How to run

1. `npm install`
2. `npm start`
3. Make sure you have started the `webrtc-monitoring-backend`
4. Visit [http://localhost:8080/?clientId=1234] to set the clientId and start a call

## Building production bundle

Run `npm run build`

Please note that this command might not exit because of `rollup-plugin-livereload`


## URL Parameters

[http://localhost:8080/?mockStats=true&clientId=1234&token=x.x.x]
