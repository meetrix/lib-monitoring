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
