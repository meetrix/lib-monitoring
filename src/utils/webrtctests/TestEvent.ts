export enum TestEvent {
  START = 'start',
  MESSAGE = 'message',
  END = 'end'
}

export type TestEventCallback = <T>(event: TestEvent, args: T) => void;
