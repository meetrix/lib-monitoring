type statusType = '' | 'running' | 'success' | 'failure';

export enum Strategy {
  AND,
  OR,
}

export default function deriveOverallStatus(
  subStatuses: [] | string[],
  strategy: Strategy = Strategy.AND,
  optionalSubStatuses: statusType[] | string[] = [],
): statusType {
  let result;
  if (strategy === Strategy.AND) {
    result = subStatuses.every(status => status === 'success')
      ? 'success'
      : subStatuses.every(status => status === '')
      ? ''
      : subStatuses.some(status => status === 'running')
      ? 'running'
      : subStatuses.some(status => status === 'failure') &&
        subStatuses.every(status => status !== '')
      ? 'failure'
      : 'running';
  } else {
    result = subStatuses.every(status => status === '')
      ? ''
      : subStatuses.some(status => status === 'running')
      ? 'running'
      : subStatuses.some(status => status === '')
      ? 'running'
      : subStatuses.some(status => status === 'success')
      ? 'success'
      : 'failure';
  }

  const resultWithOptional = [result, ...optionalSubStatuses];
  result = resultWithOptional.every(status => status === '')
    ? ''
    : resultWithOptional.some(status => status === 'running')
    ? 'running'
    : resultWithOptional.some(status => status === '')
    ? 'running'
    : result;

  return result as statusType;
}
