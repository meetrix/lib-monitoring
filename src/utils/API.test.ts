import API from './API';
const TOKEN = 'xxxxx';
const CLIENT_ID = '1234';

describe('API test', () => {
  it('Should create an instance of API', () => {
    expect(
      new API({
        token: TOKEN,
        clientId: CLIENT_ID,
        baseUrl: 'http://localhost:9100',
      }),
    ).toBeInstanceOf(API);
  });
});
