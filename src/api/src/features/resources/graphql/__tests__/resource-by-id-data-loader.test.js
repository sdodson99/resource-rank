const {
  GetManyResourcesByIdsQuery,
} = require('../../queries/get-many-resources-by-ids-query');
const { when } = require('jest-when');
const {
  createResourceByIdDataLoader,
} = require('../resource-by-id-data-loader');

jest.mock('../../queries/get-many-resources-by-ids-query');

describe('createResourceByIdDataLoader', () => {
  let mockExecuteGetManyResourcesByIdsQuery;

  beforeEach(() => {
    mockExecuteGetManyResourcesByIdsQuery = jest.fn();
    GetManyResourcesByIdsQuery.mockReturnValue({
      execute: mockExecuteGetManyResourcesByIdsQuery,
    });
  });

  afterEach(() => {
    GetManyResourcesByIdsQuery.mockReset();
  });

  describe('returned data loader', () => {
    it('should load resource from get many resources by ID query', async () => {
      const ids = ['1', '2', '3'];
      const expectedResources = [{ id: '1' }, { id: '2' }, { id: '3' }];
      when(mockExecuteGetManyResourcesByIdsQuery)
        .calledWith(ids)
        .mockResolvedValue(expectedResources);

      const dataLoader = createResourceByIdDataLoader();
      const users = await dataLoader.loadMany(ids);

      expect(users).toEqual(expectedResources);
    });
  });
});
