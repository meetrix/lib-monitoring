export interface ISubMessages {
  [context: string]: string[];
}

export interface ISubStatus {
  [context: string]: string;
}

export interface ITestState {
  status: '' | 'running' | 'success' | 'failure';
  subMessages: ISubMessages;
  subStatus: ISubStatus;
  error: string;
}
