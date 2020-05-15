import getStateAbbreviation from '../getStateAbbreviation';

describe('getStateAbbreviation', () => {
  test('returns correct abbreviated state if it exists', () => {
    expect(getStateAbbreviation('California')).toEqual('CA');
  })
  test('returns an empty string if location is not in state list', () => {
    expect(getStateAbbreviation('New Guinea')).toEqual('');
  })
})