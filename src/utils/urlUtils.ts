// import qs from 'qs'

export interface URLParametersType {
  token?: string | undefined;
  mockStats?: boolean;
  mockArgs?: { [key: string]: string };
  clientId?: string | undefined;
}

// TODO: `qs` throws this error -> util is undefined. Needs fixing. Mocking for now

const splitByComma = (str?: string) =>
  str?.split(',')?.reduce((acc, curr) => {
    const [key, value] = curr.split('=');
    acc[key] = value;
    return acc;
  }, {} as { [key: string]: string });

export const getUrlParams = (
  paramsStr: string = window?.location?.search,
  options?: any,
): URLParametersType => {
  const searchParams = new URLSearchParams(paramsStr);

  return {
    token: searchParams.get('token') || undefined,
    mockStats: searchParams.get('mockStats') === 'true',
    mockArgs: splitByComma(searchParams.get('mockArgs') || undefined),
    clientId: searchParams.get('clientId') || undefined,
  };
};

export default getUrlParams;
