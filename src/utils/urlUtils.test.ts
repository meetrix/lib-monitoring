import { getUrlParams } from './urlUtils';

describe('UrlParameters', () => {
  it('should extract mockStats', () => {
    const url = '?mockStats=true';
    const { mockStats } = getUrlParams(url);
    expect(mockStats).toEqual(true);
  });

  it('should extract troubleshooterMock', () => {
    const url = '?mockStats=true&troubleshooterMock=key1=value1,key2=value2';
    const { troubleshooterMock } = getUrlParams(url);
    expect(troubleshooterMock).toEqual({ key1: 'value1', key2: 'value2' });
  });
});
