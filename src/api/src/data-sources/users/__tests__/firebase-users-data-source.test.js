const { when } = require('jest-when');
const FirebaseUsersDataSource = require('../firebase-users-data-source');

describe('FirebaseUsersDataSource', () => {
  let firebaseUsersDataSource;

  let mockGetUsers;

  let userId;

  beforeEach(() => {
    mockGetUsers = jest.fn();
    const mockFirebaseApp = {
      auth: () => ({
        getUsers: mockGetUsers,
      }),
    };

    firebaseUsersDataSource = new FirebaseUsersDataSource(mockFirebaseApp);

    userId = '123123123';
  });

  describe('getUser', () => {
    it('should return user if user exists for ID', async () => {
      const expectedUser = { uid: userId, name: 'test' };
      when(mockGetUsers)
        .calledWith([{ uid: userId }])
        .mockReturnValue({ users: [expectedUser], notFound: [] });

      const actualUser = await firebaseUsersDataSource.getUser(userId);

      expect(actualUser).toBe(expectedUser);
    });

    it('should return empty object if user does not exist for ID', async () => {
      const expectedUser = {};
      when(mockGetUsers)
        .calledWith([{ uid: userId }])
        .mockReturnValue({ users: [], notFound: [] });

      const actualUser = await firebaseUsersDataSource.getUser(userId);

      expect(actualUser).toEqual(expectedUser);
    });

    it('should return empty object if getting user throws error', async () => {
      const expectedUser = {};
      when(mockGetUsers)
        .calledWith([{ uid: userId }])
        .mockImplementationOnce(() => {
          throw new Error();
        });

      const actualUser = await firebaseUsersDataSource.getUser(userId);

      expect(actualUser).toEqual(expectedUser);
    });
  });
});
