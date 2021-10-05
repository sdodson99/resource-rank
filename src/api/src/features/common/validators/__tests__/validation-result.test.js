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
    it('should return invalid result for code and message', () => {
      const expectedCode = 'ERROR_CODE';
      const expectedMessage = 'error message';

      const {
        isValid,
        code: actualCode,
        message: actualMessage,
      } = createInvalidResult(expectedCode, expectedMessage);

      expect(isValid).toBeFalsy();
      expect(actualCode).toBe(expectedCode);
      expect(actualMessage).toBe(expectedMessage);
    });
  });
});
