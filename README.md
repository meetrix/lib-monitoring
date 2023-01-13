# Meetrix Lib Call Quality

1. This project was bootstrapped with : [https://github.com/alexjoverm/typescript-library-starter.git]
2. Underlying peer metric library: [https://github.com/peermetrics/webrtc-stats]

## Project can be run on following OS

1. Ubuntu
2. MacOS
3. Windows

## Prerequisites

The following pre-requisites should be setup through your terminal on your development machine. Please refer to tool installation guides by the developers to set these up. 

1. Git
2. Node 12

## Adding global variables for testing

The tests run on `node` environment instead of the real browser environment. Because of that, some browser variables like `window`, WebRTC API are not available in test environment. Therefore, we have to setup them in `setup.jest.js`

## How to run

1. `npm install`
2. `npm start`
5. Make sure you have started the `webrtc-monitoring-backend`
6. Visit [http://localhost:8080/?clientId=1234] to set the clientId and start a call

## Testing UI

UI can be tested by passing url search params

1. `mockStatus=true` mocks troubleshooter and other tests
2. `troubleshooterMock=component=camera,status=running` sets the given status to the selected troubleshooter test, and sets 'success' status to all preceding tests.

e.g.: [http://localhost:8080/?mockStats=true&troubleshooterMock=component=camera,status=running]

## Building production bundle

Run `npm run build`

## URL Parameters

1. `mockStatus` search param: see above Testing UI section
2. `troubleshooterMock` search param: see above Testing UI section
3. `troubleshooterOnly` run only selected troubleshooter tests: (default `browser,audio,video,network`)
4. `clientId` sets the clientId (by default automatically generated and saved in the browser)
5. `token` sets the JWT auth token for a. a user or, b. a plugin

See more: src/utils/urlUtils.ts

e.g.: [http://localhost:8080/?mockStats=true&clientId=1234&token=x.x.x]

## Consuming as a library

1. insert webrtc-monitoring-common-lib to dependencies array
   ```sh
   "@meetrix/lib-monitoring": "git+https://github.com/meetrix/lib-monitoring",

2. Import it into your source code

   ```js
   import Monitor from '@meetrix/lib-monitoring/dist/lib/lib-call-quality-monitoring';
   ```

## Deployment

1. Decide on a version number https://semver.org/
2. Update package.json and package-lock.json "version" field
3. Add/merge this to master/main branch
