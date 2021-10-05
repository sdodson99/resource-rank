const { when } = require('jest-when');
const { UsersDataSource } = require('../users-data-source');
const { createUserByIdDataLoader } = require('../user-by-id-data-loader');

jest.mock('../user-by-id-data-loader');

describe('UsersDataSource', () => {
  let usersDataSource;

  let mockUserByIdLoad;

  beforeEach(() => {
    mockUserByIdLoad = jest.fn();
    const mockFirebaseApp = {};
    when(createUserByIdDataLoader).calledWith(mockFirebaseApp).mockReturnValue({
      load: mockUserByIdLoad,
    });

    usersDataSource = new UsersDataSource(mockFirebaseApp);
  });

  afterEach(() => {
    createUserByIdDataLoader.mockReset();
  });

  describe('getById', () => {
    let userId;

    beforeEach(() => {
      userId = '1';
    });

    it('should return null if user not found', async () => {
      when(mockUserByIdLoad).calledWith(userId).mockReturnValue(null);

      const user = await usersDataSource.getById(userId);

      expect(user).toBeNull();
    });

    it('should return null if user query failed', async () => {
      when(mockUserByIdLoad)
        .calledWith(userId)
        .mockImplementation(() => {
          throw new Error();
        });

      const user = await usersDataSource.getById(userId);

      expect(user).toBeNull();
    });

    it('should return user if user successfully loaded', async () => {
      const expectedUser = {};
      when(mockUserByIdLoad).calledWith(userId).mockReturnValue(expectedUser);

      const user = await usersDataSource.getById(userId);

      expect(user).toBe(expectedUser);
    });
  });
});
