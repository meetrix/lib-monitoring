// import qs from 'qs'

export interface URLParametersType {
  token?: string | undefined;
  mockStats?: boolean;
  troubleshooterMock?: { [key: string]: string };
  troubleshooterOnly?: string[];
  clientId?: string | undefined;
}

// TODO: `qs` throws this error -> util is undefined. Needs fixing. Mocking for now

const commaSeparatedDictionary = (str?: string) =>
  str?.split(',')?.reduce((acc, curr) => {
    const [key, value] = curr.split('=');
    acc[key] = value;
    return acc;
  }, {} as { [key: string]: string });

const commaSeparatedList = (str?: string) => str?.split(',');

export const getUrlParams = (
  paramsStr: string = window?.location?.search,
  options?: any,
): URLParametersType => {
  const searchParams = new URLSearchParams(paramsStr);

  return {
    token: searchParams.get('token') || undefined,
    mockStats: searchParams.get('mockStats') === 'true',
    troubleshooterMock: commaSeparatedDictionary(
      searchParams.get('troubleshooterMock') || undefined,
    ),
    troubleshooterOnly: commaSeparatedList(searchParams.get('troubleshooterOnly') || undefined),
    clientId: searchParams.get('clientId') || undefined,
  };
};

export default getUrlParams;
