export const statuses = ['', 'success', 'failure', 'running'] as const;
export const components = ['browser', 'microphone', 'camera', 'network'] as const;
export const subComponents = {
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

export interface ISubMessages {
  [context: string]: string[];
}

export interface ISubStatus {
  [context: string]: string;
}

export interface ITestState {
  status: '' | 'running' | 'success' | 'failure';
  subOrder: string[];
  subMessages: ISubMessages;
  subStatus: ISubStatus;
  message: string;
}

export interface ITestView extends ITestState {
  key: typeof components[number];
  label: string;
}
