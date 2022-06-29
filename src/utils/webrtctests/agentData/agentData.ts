import DetectRTC from 'detectrtc';

const timeout = <T>(promise: Promise<T>, ms: number = 10_000) => {
  return Promise.race([
    promise,
    new Promise<never>((_resolve, reject) => setTimeout(() => reject('Operation timed out.'), ms)),
  ]);
};

export const promisifyDetectRTC = async (): Promise<typeof DetectRTC> => {
  return timeout(
    new Promise(async (resolve, reject) => {
      DetectRTC.load(() => {
        resolve(DetectRTC);
      });
    }),
  );
};

export const getAgentData = async (): Promise<any> => {
  const detectRTC = await promisifyDetectRTC();

  return {
    browser: {
      name: detectRTC.browser.name,
      version: detectRTC.browser.fullVersion,
      isPrivateBrowsing: detectRTC.browser.isPrivateBrowsing,
    },
    os: {
      name: detectRTC.osName,
      version: detectRTC.osVersion,
    },
    audioInputDevices: detectRTC.audioInputDevices,
    audioOutputDevices: detectRTC.audioOutputDevices,
    videoInputDevices: detectRTC.videoInputDevices,
    display: {
      aspectRatio: detectRTC.displayAspectRatio,
      resolution: detectRTC.displayResolution,
    },
  };
};
