const validateTopic = require('..');
const hasAlphaNumericCharacter = require('../../../common/validators/alpha-numeric');
const isProfane = require('../../../common/validators/profanity');

jest.mock('../../../common/validators/profanity');
jest.mock('../../../common/validators/alpha-numeric');

describe('validateTopic', () => {
  afterEach(() => {
    hasAlphaNumericCharacter.mockReset();
    isProfane.mockReset();
  });

  it('should return topic required result if topic name is null', () => {
    const expectedCode = 'TOPIC_REQUIRED';

    const { isValid, code: actualCode } = validateTopic(null);

    expect(isValid).toBeFalsy();
    expect(actualCode).toBe(expectedCode);
  });

  it('should return name required result if topic name is null or empty', () => {
    const expectedCode = 'NAME_REQUIRED';

    const { isValid, code: actualCode } = validateTopic({ name: null });

    expect(isValid).toBeFalsy();
    expect(actualCode).toBe(expectedCode);
  });

  it('should return name length result if topic name does not satisfy max length', () => {
    const expectedCode = 'NAME_LENGTH';

    const { isValid, code: actualCode } = validateTopic({
      name: '111111111111111111111111111111111111111111111111111',
    });

    expect(isValid).toBeFalsy();
    expect(actualCode).toBe(expectedCode);
  });

  it('should return name no alpha-numeric result if topic name has no alpha-numeric characters', () => {
    hasAlphaNumericCharacter.mockReturnValue(false);
    const expectedCode = 'NAME_NO_ALPHA_NUMERIC';

    const { isValid, code: actualCode } = validateTopic({ name: '!@#$' });

    expect(isValid).toBeFalsy();
    expect(actualCode).toBe(expectedCode);
  });

  it('should return name profanity result if topic name contains profanity', () => {
    hasAlphaNumericCharacter.mockReturnValue(true);
    isProfane.mockReturnValue(true);
    const expectedCode = 'NAME_PROFANITY';

    const { isValid, code: actualCode } = validateTopic({
      name: 'mock-bad-word :)',
    });

    expect(isValid).toBeFalsy();
    expect(actualCode).toBe(expectedCode);
  });

  it('should return slug required result if topic slug is empty', () => {
    hasAlphaNumericCharacter.mockReturnValue(true);
    const expectedCode = 'SLUG_REQUIRED';

    const { isValid, code: actualCode } = validateTopic({
      name: 'good name',
      slug: null,
    });

    expect(isValid).toBeFalsy();
    expect(actualCode).toBe(expectedCode);
  });

  it('should return valid result if topic is valid', () => {
    hasAlphaNumericCharacter.mockReturnValue(true);

    const { isValid, code } = validateTopic({
      name: 'good name',
      slug: 'good-name',
    });

    expect(isValid).toBeTruthy();
    expect(code).toBeUndefined();
  });
});
