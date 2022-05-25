import { ISubMessages, ISubStatus, ITestState } from '../../ui/slice/types';

const statuses = ['', 'success', 'failure', 'running'] as const;
const components = ['browser', 'microphone', 'camera', 'network'] as const;
const subComponents = {
  browser: ['default'],
  microphone: ['default'],
  camera: ['p240', 'p480', 'p720', 'generic'],
  network: [
    'connection-relay',
    'connection-reflexive',
    'connection-host',
    'network-udp',
    'network-tcp',
    'network-ipv6',
    'bandwidth-throughput',
    'bandwidth-bandwidth',
  ],
} as const;

interface IFakeStateParams {
  status: typeof statuses[number];
  component: typeof components[number];
  subComponent: typeof subComponents[typeof components[number]][number];
}

function generateFakeSubMessage(step: number, fail: boolean) {
  return `Procedure ${step} ${fail ? 'failed due to an error' : 'completed successfully'}.`;
}

function generateFakeSubStatus(fail: boolean) {
  return fail ? 'failure' : 'success';
}

function generateFakeSubState(steps: number, fail: boolean) {
  const subMessages = [];
  const subStatus = generateFakeSubStatus(fail);
  for (let i = 0; i < steps - 1; i++) {
    subMessages.push(generateFakeSubMessage(i + 1, false));
  }

  if (fail) {
    subMessages.push(generateFakeSubMessage(steps, true));
  } else {
    subMessages.push(generateFakeSubMessage(steps, false));
  }

  return {
    subMessages,
    subStatus,
  };
}

function generateFakeMessage(params: IFakeStateParams) {
  const { component, status } = params;
  switch (status) {
    case 'success':
      return `No issues found.`;
    case 'failure':
      return `Your ${component} has some issues.`;
    case 'running':
      return `Checking your ${component}`;
    default:
      return `Not started yet.`;
  }
}

export function generateFakeState({
  component,
  status,
  subComponent,
}: IFakeStateParams): ITestState {
  const numStages = subComponents[component].length;
  const subMessagesX: ISubMessages = {};
  const subStatusX: ISubStatus = {};
  for (let i = 0; subComponents[component][i] !== subComponent && i < numStages; i++) {
    const { subMessages, subStatus } = generateFakeSubState(3, false);
    subMessagesX[subComponents[component][i]] = subMessages;
    subStatusX[subComponents[component][i]] = subStatus;
  }

  subMessagesX[subComponent] = generateFakeSubState(2, status === 'failure').subMessages;
  subStatusX[subComponent] = generateFakeSubState(2, status === 'failure').subStatus;

  return {
    status,
    subOrder: [...subComponents[component]],
    subMessages: subMessagesX,
    subStatus: subStatusX,
    message: generateFakeMessage({ component, status, subComponent }),
  };
}
