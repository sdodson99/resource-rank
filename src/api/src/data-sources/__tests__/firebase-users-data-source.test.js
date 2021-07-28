const FirebaseUsersDataSource = require('../firebase-users-data-source');

describe('FirebaseUsersDataSource', () => {
  let firebaseUsersDataSource;

  let mockGetUser;

  let userId;

  beforeEach(() => {
    mockGetUser = jest.fn();
    const stubFirebaseApp = {
      auth: () => ({
        getUser: mockGetUser,
      }),
    };

    firebaseUsersDataSource = new FirebaseUsersDataSource(stubFirebaseApp);

    userId = '123123123';
  });

  describe('getUser', () => {
    it('should return user if user exists for ID', async () => {
      const expectedUser = { name: 'test' };
      mockGetUser.mockReturnValueOnce(expectedUser);

      const actualUser = await firebaseUsersDataSource.getUser(userId);

      expect(actualUser).toBe(expectedUser);
    });

    it('should return empty object if user does not exist for ID', async () => {
      const expectedUser = {};
      mockGetUser.mockReturnValueOnce(null);

      const actualUser = await firebaseUsersDataSource.getUser(userId);

      expect(actualUser).toEqual(expectedUser);
    });

    it('should return empty object if getting user throws error', async () => {
      const expectedUser = {};
      mockGetUser.mockImplementationOnce(() => {
        throw new Error();
      });

      const actualUser = await firebaseUsersDataSource.getUser(userId);

      expect(actualUser).toEqual(expectedUser);
    });
  });
});
