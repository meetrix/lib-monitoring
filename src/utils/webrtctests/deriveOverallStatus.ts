type statusType = '' | 'running' | 'success' | 'failure';

export default function deriveOverallStatus(subStatuses: statusType[] | string[]) {
  const result = subStatuses.every(status => status === 'success')
    ? 'success'
    : subStatuses.some(status => status === 'running')
    ? 'running'
    : subStatuses.some(status => status === 'failure')
    ? 'failure'
    : '';

  return result;
}
