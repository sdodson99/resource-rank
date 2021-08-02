import ErrorCode from '../error-code';
import getErrorCode from '../get-error-code';

describe('getErrorCode', () => {
  it('should return null if response has no errors array', () => {
    const errorCode = getErrorCode('not an array');

    expect(errorCode).toBeNull;
  });

  it('should return null if response has empty errors array', () => {
    const errorCode = getErrorCode({
      response: {
        errors: [],
      },
    });

    expect(errorCode).toBeNull;
  });

  it('should return first error code if response has errors array', () => {
    const expected = ErrorCode.TOPIC_NAME_ERROR;

    const actual = getErrorCode({
      response: {
        errors: [
          {
            extensions: {
              code: expected,
            },
          },
        ],
      },
    });

    expect(actual).toBe(expected);
  });
});
