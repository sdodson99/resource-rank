const FirebaseUserDecoder = require('../firebase-user-decoder');

describe('FirebaseUserDecoder', () => {
  let firebaseUserDecoder;

  let mockVerifyIdToken;

  let stubRequest;
  let token;

  beforeEach(() => {
    mockVerifyIdToken = jest.fn();
    const stubFirebaseApp = {
      auth: () => ({
        verifyIdToken: mockVerifyIdToken,
      }),
    };

    firebaseUserDecoder = new FirebaseUserDecoder(stubFirebaseApp);

    stubRequest = {
      headers: {
        authorization: null,
      },
    };
    token = '123123123123';
  });

  describe('getUserFromRequest', () => {
    it('should return null when request has no authorization header value', async () => {
      const user = await firebaseUserDecoder.getUserFromRequest(stubRequest);

      expect(user).toBeNull();
    });

    it('should return null when request has authorization header without bearer prefix', async () => {
      stubRequest.headers.authorization = `not-Bearer ${token}`;

      const user = await firebaseUserDecoder.getUserFromRequest(stubRequest);

      expect(user).toBeNull();
    });

    it('should return null when token verification fails', async () => {
      stubRequest.headers.authorization = `Bearer ${token}`;
      mockVerifyIdToken.mockImplementation(() => {
        throw new Error();
      });

      const user = await firebaseUserDecoder.getUserFromRequest(stubRequest);

      expect(user).toBeNull();
    });

    it('should return user when token verification succeeds', async () => {
      stubRequest.headers.authorization = `Bearer ${token}`;
      const expectedUser = { name: 'test' };
      mockVerifyIdToken.mockReturnValueOnce(expectedUser);

      const actualUser = await firebaseUserDecoder.getUserFromRequest(
        stubRequest
      );

      expect(actualUser).toBe(expectedUser);
    });
  });
});
