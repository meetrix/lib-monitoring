import { getUrlParams } from './urlUtils';

describe('UrlParameters', () => {
  it('should extract mockStats', () => {
    const url = '?mockStats=true';
    const { mockStats } = getUrlParams(url);
    expect(mockStats).toEqual(true);
  });

  it('should extract mockArgs', () => {
    const url = '?mockStats=true&mockArgs=key1=value1,key2=value2';
    const { mockArgs } = getUrlParams(url);
    expect(mockArgs).toEqual({ key1: 'value1', key2: 'value2' });
  });
});
