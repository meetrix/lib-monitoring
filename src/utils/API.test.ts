import API from './API';

describe('API test', () => {
  it('Should create an instance of API', () => {
    expect(new API('https://meetrix.io')).toBeInstanceOf(API);
  });
});
