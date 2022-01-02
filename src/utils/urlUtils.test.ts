import { getUrlParams } from './urlUtils'

describe('UrlParameters', () => {
  it('should extract mockStats', () => {
    const url = '?mockStats=true'
    const { mockStats } = getUrlParams(url)
    expect(mockStats).toEqual(true)
  })
})
