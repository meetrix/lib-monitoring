import { promisifyDetectRTC } from '../agentData/agentData';
import { TestEvent, TestEventCallback } from '../TestEvent';

const sleep = (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

let report: TestEventCallback;

const message = (
  message: TemplateStringsArray,
  result: boolean,
  status: string = '',
): [TestEvent, string] => {
  return [
    TestEvent.MESSAGE,
    `[ ${result ? 'OK' : 'FAILED'} ] ${message.join(' ')}${status && `: ${status}`}`,
  ];
};

const runBrowserTests = async (callback: TestEventCallback): Promise<boolean> => {
  report = callback;
  report(TestEvent.START, '');
  try {
    const detectRTC = await promisifyDetectRTC();
    report(TestEvent.MESSAGE, `[ INFO ] DetectRTC loaded.`);

    const {
      hasSpeakers,
      hasMicrophone,
      hasWebcam,
      isWebsiteHasMicrophonePermissions,
      isWebsiteHasWebcamPermissions,
      isGetUserMediaSupported,
      isSetSinkIdSupported,
      isApplyConstraintsSupported,
      isWebRTCSupported,
      isORTCSupported,
      isRTPSenderReplaceTracksSupported,
      isRemoteStreamProcessingSupported,
      isWebSocketsSupported,
      // isWebSocketsBlocked,
      isAudioContextSupported,
      isSctpDataChannelsSupported,
      isRtpDataChannelsSupported,
      isScreenCapturingSupported,
      isMultiMonitorScreenCapturingSupported,
      // isMobileDevice,
      isVideoSupportsStreamCapturing,
      isPromisesSupported,
    } = detectRTC;

    await sleep(100);
    report(...message`Speakers ${hasSpeakers}`);
    report(...message`Microphone ${hasMicrophone}`);
    report(...message`Webcam ${hasWebcam}`);
    report(...message`Microphone permissions ${isWebsiteHasMicrophonePermissions}`);
    report(...message`Webcam permissions ${isWebsiteHasWebcamPermissions}`);
    report(...message`GetUserMedia ${isGetUserMediaSupported}`);
    report(...message`Change output audio devices ${isSetSinkIdSupported}`);
    report(...message`Live apply camera constraints ${isApplyConstraintsSupported}`);
    report(...message`WebRTC (1.0 or 1.1) ${isWebRTCSupported}`);
    report(...message`ORTC (WebRTC 1.1) ${isORTCSupported}`);
    report(
      ...message`Replace tracks without renegotiating peers ${isRTPSenderReplaceTracksSupported}`,
    );
    report(...message`Record/process remote audio ${isRemoteStreamProcessingSupported}`);
    report(...message`WebSockets ${isWebSocketsSupported}`);
    // report(...message`WebSockets not blocked ${!isWebSocketsBlocked}`);
    report(...message`WebAudio API ${isAudioContextSupported}`);
    report(...message`SCTP data channels ${isSctpDataChannelsSupported}`);
    report(...message`RTP data channels ${isRtpDataChannelsSupported}`);
    report(...message`Screen capturing ${isScreenCapturingSupported}`);
    report(
      TestEvent.MESSAGE,
      message`Multi-Monitor screen capturing ${isMultiMonitorScreenCapturingSupported}`,
    );
    // report(...message`MobileDevice ${true} ${isMobileDevice}`);
    report(
      TestEvent.MESSAGE,
      message`Capture stream from video/canvas ${isVideoSupportsStreamCapturing}`,
    );
    report(...message`Promises ${isPromisesSupported}`);
    await sleep(200);

    const mandatory = [
      hasSpeakers,
      hasMicrophone,
      hasWebcam,
      isWebsiteHasMicrophonePermissions,
      isWebsiteHasWebcamPermissions,
      isWebRTCSupported,
    ];
    if (mandatory.some(x => !x)) {
      report(TestEvent.MESSAGE, `[ FAILED ] Mandatory conditions not satisfied.`);
      report(TestEvent.END, 'failure');
      return false;
    }

    report(TestEvent.MESSAGE, `[ OK ] Mandatory conditions satisfied.`);
    report(TestEvent.END, 'success');
    return true;
  } catch (error) {
    report(TestEvent.MESSAGE, `[ FAILED ] Browser failure: ${error}`);
    report(TestEvent.END, 'failure');
    return false;
  }
};

export default runBrowserTests;
