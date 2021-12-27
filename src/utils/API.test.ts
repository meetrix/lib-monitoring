import API from './API'
const TOKEN = 'xxxxx'

describe('API test', () => {
  it('Should create an instance of API', () => {
    expect(
      new API({
        token: TOKEN
      })
    ).toBeInstanceOf(API)
  })
})
