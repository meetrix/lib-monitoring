// import qs from 'qs'

export interface URLParametersType {
  token?: string | undefined
  mockStats?: boolean
  clientId?: string | undefined
}

// TODO: `qs` throws this error -> util is undefined. Needs fixing. Mocking for now

export const getUrlParams = (urlParams?: string, options?: any): URLParametersType => {
  const parameters = urlParams || window?.location?.search
  const regexp = parameters.match(/([^?=&]+)(=([^&]*))/g)
  if (!regexp || !parameters.match(/\?/g)) {
    return {}
  }
  const { token, mockStats, clientId }: URLParametersType = regexp.reduce((a: any, v: string) => {
    return (a[v.slice(0, v.indexOf('='))] = v.slice(v.indexOf('=') + 1)), a
  }, {})

  return { token, mockStats: !!mockStats, clientId }
}
export default getUrlParams
