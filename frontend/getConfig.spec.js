import getConfig from './getConfig';

jest.mock('./config', () => ({
  one: 1,
}));

describe('.getConfig', () => {
  it('should return object', () => {
    expect(getConfig()).toEqual({
      one: 1
    });
  })
});