const {
  GetManyUsersByIdsQuery,
} = require('../../queries/get-many-users-by-ids-query');
const { when } = require('jest-when');
const { createUserByIdDataLoader } = require('../user-by-id-data-loader');

jest.mock('../../queries/get-many-users-by-ids-query');

describe('createUserByIdDataLoader', () => {
  let mockFirebaseApp;
  let mockExecuteGetManyUsersByIdsQuery;
  let mockMaxBatchSize;

  beforeEach(() => {
    mockFirebaseApp = {};
    mockExecuteGetManyUsersByIdsQuery = jest.fn();
    mockMaxBatchSize = 100;
    when(GetManyUsersByIdsQuery).calledWith(mockFirebaseApp).mockReturnValue({
      execute: mockExecuteGetManyUsersByIdsQuery,
      maxBatchSize: mockMaxBatchSize,
    });
  });

  afterEach(() => {
    GetManyUsersByIdsQuery.mockReset();
  });

  describe('returned data loader', () => {
    it('should load users from get many users by ID query', async () => {
      const ids = ['1', '2', '3'];
      const expectedUsers = [{ id: '1' }, { id: '2' }, { id: '3' }];
      when(mockExecuteGetManyUsersByIdsQuery)
        .calledWith(ids)
        .mockResolvedValue(expectedUsers);

      const dataLoader = createUserByIdDataLoader(mockFirebaseApp);
      const users = await dataLoader.loadMany(ids);

      expect(users).toEqual(expectedUsers);
    });

    it('should execute batch function multiple times if batch size exceeds max', async () => {
      const ids = [...Array(mockMaxBatchSize + 1).keys()];

      const dataLoader = createUserByIdDataLoader(mockFirebaseApp);
      await dataLoader.loadMany(ids);

      expect(mockExecuteGetManyUsersByIdsQuery).toBeCalledTimes(2);
    });
  });
});
