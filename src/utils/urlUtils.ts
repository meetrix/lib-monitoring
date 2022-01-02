// import qs from 'qs'

export interface URLParametersType {
  jwt?: string | undefined
  mockStats?: boolean
}

// TODO: `qs` throws this error -> util is undefined. Needs fixing. Mocking for now

export const getUrlParams = (urlParams?: string, options?: any): URLParametersType => {
  const parameters = urlParams || window?.location?.search
  const regexp = parameters.match(/([^?=&]+)(=([^&]*))/g)
  if (!regexp || !parameters.match(/\?/g)) {
    return {}
  }
  const { jwt, mockStats }: URLParametersType = regexp.reduce((a: any, v: string) => {
    return (a[v.slice(0, v.indexOf('='))] = v.slice(v.indexOf('=') + 1)), a
  }, {})

  return { jwt: '', mockStats: !!mockStats }
}
export default getUrlParams
