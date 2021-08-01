const {
  createValidResult,
  createInvalidResult,
} = require('../validation-result');

describe('validation result', () => {
  describe('createValidResult', () => {
    it('should return valid result', () => {
      const { isValid } = createValidResult();

      expect(isValid).toBeTruthy();
    });
  });

  describe('createInvalidResult', () => {
    it('should return invalid result for code', () => {
      const expectedCode = 'ERROR_CODE';

      const { isValid, code: actualCode } = createInvalidResult(expectedCode);

      expect(isValid).toBeFalsy();
      expect(actualCode).toBe(expectedCode);
    });
  });
});
