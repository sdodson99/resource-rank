const { when } = require('jest-when');
const { GetManyUsersByIdsQuery } = require('../get-many-users-by-ids-query');

describe('GetManyUsersByIdsQuery', () => {
  let query;

  let mockFirebaseGetUsers;

  beforeEach(() => {
    mockFirebaseGetUsers = jest.fn();
    const mockFirebaseApp = {
      auth: () => ({ getUsers: mockFirebaseGetUsers }),
    };

    query = new GetManyUsersByIdsQuery(mockFirebaseApp);
  });

  describe('execute', () => {
    it('should throw error if user IDs length greater than 100', async () => {
      const userIds = {
        length: 101,
      };

      await expect(async () => {
        await query.execute(userIds);
      }).rejects.toThrow('Amount of user IDs cannot exceed 100.');
    });

    it('should return users array parallel to user IDs array', async () => {
      const userIds = ['1', '2', '3'];
      when(mockFirebaseGetUsers)
        .calledWith([{ uid: '1' }, { uid: '2' }, { uid: '3' }])
        .mockReturnValue({
          users: [
            { uid: '1', displayName: 'user1' },
            { uid: '2', displayName: 'user2' },
            { uid: '3', displayName: 'user3' },
          ],
        });
      const expected = [
        { id: '1', username: 'user1' },
        { id: '2', username: 'user2' },
        { id: '3', username: 'user3' },
      ];

      const users = await query.execute(userIds);

      expect(users).toEqual(expected);
    });
  });
});
