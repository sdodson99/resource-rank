const hasAlphaNumericCharacter = require('..');

describe('hasAlphaNumericCharacter', () => {
  it('should return true when value has alpha-numeric character', () => {
    const result = hasAlphaNumericCharacter('g@');

    expect(result).toBeTruthy();
  });

  it('should return false when value has no alpha-numeric character', () => {
    const result = hasAlphaNumericCharacter('!@#$');

    expect(result).toBeFalsy();
  });
});
