const validateResource = require('..');
const hasAlphaNumericCharacter = require('../../alpha-numeric');
const isProfane = require('../../profanity');
const { isURL } = require('validator');

jest.mock('../../profanity');
jest.mock('../../alpha-numeric');
jest.mock('validator');

describe('validateResource', () => {
  afterEach(() => {
    hasAlphaNumericCharacter.mockReset();
    isProfane.mockReset();
    isURL.mockReset();
  });

  it('should return resource required result if resource name is null', () => {
    const expectedCode = 'RESOURCE_REQUIRED';

    const { isValid, code: actualCode } = validateResource(null);

    expect(isValid).toBeFalsy();
    expect(actualCode).toBe(expectedCode);
  });

  it('should return name required result if resource name is null or empty', () => {
    const expectedCode = 'NAME_REQUIRED';

    const { isValid, code: actualCode } = validateResource({ name: null });

    expect(isValid).toBeFalsy();
    expect(actualCode).toBe(expectedCode);
  });

  it('should return name length result if resource name does not satisfy max length', () => {
    const expectedCode = 'NAME_LENGTH';

    const { isValid, code: actualCode } = validateResource({
      name: '111111111111111111111111111111111111111111111111111',
    });

    expect(isValid).toBeFalsy();
    expect(actualCode).toBe(expectedCode);
  });

  it('should return name no alpha-numeric result if resource name has no alpha-numeric characters', () => {
    hasAlphaNumericCharacter.mockReturnValue(false);
    const expectedCode = 'NAME_NO_ALPHA_NUMERIC';

    const { isValid, code: actualCode } = validateResource({ name: '!@#$' });

    expect(isValid).toBeFalsy();
    expect(actualCode).toBe(expectedCode);
  });

  it('should return name profanity result if resource name contains profanity', () => {
    hasAlphaNumericCharacter.mockReturnValue(true);
    isProfane.mockReturnValue(true);
    const expectedCode = 'NAME_PROFANITY';

    const { isValid, code: actualCode } = validateResource({
      name: 'mock-bad-word :)',
    });

    expect(isValid).toBeFalsy();
    expect(actualCode).toBe(expectedCode);
  });

  it('should return slug required result if resource slug is empty', () => {
    hasAlphaNumericCharacter.mockReturnValue(true);
    const expectedCode = 'SLUG_REQUIRED';

    const { isValid, code: actualCode } = validateResource({
      name: 'good name',
      slug: null,
    });

    expect(isValid).toBeFalsy();
    expect(actualCode).toBe(expectedCode);
  });

  it('should return link required result if resource link is empty', () => {
    hasAlphaNumericCharacter.mockReturnValue(true);
    const expectedCode = 'LINK_REQUIRED';

    const { isValid, code: actualCode } = validateResource({
      name: 'good name',
      slug: 'good-name',
      link: null,
    });

    expect(isValid).toBeFalsy();
    expect(actualCode).toBe(expectedCode);
  });

  it('should return link invalid URL result if resource link is not a valid URL', () => {
    hasAlphaNumericCharacter.mockReturnValue(true);
    isURL.mockReturnValue(false);
    const expectedCode = 'LINK_INVALID_URL';

    const { isValid, code: actualCode } = validateResource({
      name: 'good name',
      slug: 'good-name',
      link: 'bad-link',
    });

    expect(isValid).toBeFalsy();
    expect(actualCode).toBe(expectedCode);
  });

  it('should return valid result if resource is valid', () => {
    hasAlphaNumericCharacter.mockReturnValue(true);
    isURL.mockReturnValue(true);

    const { isValid, code } = validateResource({
      name: 'good name',
      slug: 'good-name',
      link: 'goodlink.com',
    });

    expect(isValid).toBeTruthy();
    expect(code).toBeUndefined();
  });
});
