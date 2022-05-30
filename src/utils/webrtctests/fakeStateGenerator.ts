import {
  components,
  ISubMessages,
  ISubStatus,
  ITestView,
  statuses,
  subComponents,
} from '../../ui/slice/types';

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
}: IFakeStateParams): ITestView {
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
    key: component,
    label: `Checking your ${component}`,
  };
}

export function generateFakeStateList(params: IFakeStateParams): ITestView[] {
  const output: ITestView[] = [];
  const lastRunComponentIndex = components.indexOf(params.component);
  for (let i = 0; i < components.length; i++) {
    const component = components[i];
    const status =
      lastRunComponentIndex === i ? params.status : i < lastRunComponentIndex ? 'success' : '';
    const subComponent = subComponents[component][subComponents[component].length - 1];
    output.push(generateFakeState({ component, status, subComponent }));
  }

  return output;
}
