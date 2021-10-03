const { when } = require('jest-when');
const { Authenticator } = require('../authenticator');

describe('Authenticator', () => {
  let authenticator;

  let mockVerifyIdToken;

  let request;
  let token;

  beforeEach(() => {
    mockVerifyIdToken = jest.fn();
    const firebaseApp = {
      auth: () => ({
        verifyIdToken: mockVerifyIdToken,
      }),
    };

    authenticator = new Authenticator(firebaseApp);

    request = {
      headers: {
        authorization: null,
      },
    };
    token = '123';
  });

  describe('authenticate', () => {
    it('should return null when request has no authorization header value', async () => {
      const user = await authenticator.authenticate(request);

      expect(user).toBeNull();
    });

    it('should return null when request has authorization header without bearer prefix', async () => {
      request.headers.authorization = `not-Bearer ${token}`;

      const user = await authenticator.authenticate(request);

      expect(user).toBeNull();
    });

    it('should return null when token verification fails', async () => {
      request.headers.authorization = `Bearer ${token}`;
      mockVerifyIdToken.mockImplementation(() => {
        throw new Error();
      });

      const user = await authenticator.authenticate(request);

      expect(user).toBeNull();
    });

    it('should return user when token verification succeeds', async () => {
      request.headers.authorization = `Bearer ${token}`;
      const expectedUser = { id: '1' };
      when(mockVerifyIdToken)
        .calledWith(token)
        .mockReturnValueOnce({ uid: '1' });

      const actualUser = await authenticator.authenticate(request);

      expect(actualUser).toEqual(expectedUser);
    });
  });
});
