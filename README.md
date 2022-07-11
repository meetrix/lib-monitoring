# Meetrix Lib Call Quality

1. This project was bootstrapped with : [https://github.com/alexjoverm/typescript-library-starter.git]
2. Underlying peer metric library: [https://github.com/peermetrics/webrtc-stats]

## Adding global variables for testing

The tests run on `node` environment instead of the real browser environment. Because of that, some browser variables like `window`, WebRTC API are not available in test environment. Therefore, we have to setup them in `setup.jest.js`

## How to run

1. Create a [personal access token](https://docs.gitlab.com/ee/user/profile/personal_access_tokens.html#create-a-personal-access-token) (required for two-factor authentication (2FA)), with the scope set to `api`. You can save this for future use too.

2. Run the below commands (sets config for the current user; use a `-g` after `set` to set for all users)

   ```sh
   npm config set '@meetrix:registry' https://gitlab.com/api/v4/packages/npm/
   npm config set -- '//gitlab.com/api/v4/packages/npm/:_authToken' "<your_token>"
   ```

   Alternatively, you can also create a `.npmrc` file in project root with the below command to set it for just the current project

   ```sh
   {
     echo "@meetrix:registry=https://gitlab.com/api/v4/packages/npm/"
     echo "//gitlab.com/api/v4/packages/npm/:_authToken=<your_token>"
   } >> .npmrc
   ```

   Be careful not to accidentally commit `.npmrc`; add it to your `.gitignore` file.

3. `npm install`
4. `npm start`
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

1. Create a [personal access token](https://docs.gitlab.com/ee/user/profile/personal_access_tokens.html#create-a-personal-access-token) (required for two-factor authentication (2FA)), with the scope set to `api`. You can save this for future use too.
2. Run the below commands (sets config for the current user; use a `-g` after `set` to set for all users)

   ```sh
   npm config set @meetrix:registry https://gitlab.com/api/v4/packages/npm/
   npm config set -- '//gitlab.com/api/v4/packages/npm/:_authToken' "<your_token>"
   ```

   Alternatively, you can also create a `.npmrc` file in project root with the below command to set it for just the current project

   ```sh
   {
     echo "@meetrix:registry=https://gitlab.com/api/v4/packages/npm/"
     echo "//gitlab.com/api/v4/packages/npm/:_authToken=<your_token>"
   } >> .npmrc
   ```

   Be careful not to accidentally commit `.npmrc`; add it to your `.gitignore` file.

3. Import it into your source code

   ```js
   import { ... } from '@meetrix/lib-monitoring/dist/...';
   ```

## Deployment

1. Decide on a version number https://semver.org/
2. Update package.json and package-lock.json "version" field
3. Add/merge this to master/main branch
4. Create a release with version number as the tag with `v` prefix e.g.: v0.1.14

You can also manually run the blocked deployment jobs for branches so that they can be installed with `npm i <package>@<branch>`.
