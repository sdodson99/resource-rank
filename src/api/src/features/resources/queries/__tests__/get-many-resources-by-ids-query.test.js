const { when } = require('jest-when');
const {
  GetManyResourcesByIdsQuery,
} = require('../get-many-resources-by-ids-query');
const { ResourceModel } = require('../../mongoose/resource-model');

jest.mock('../../mongoose/resource-model');

describe('GetManyResourcesByIdsQuery', () => {
  let query;

  beforeEach(() => {
    query = new GetManyResourcesByIdsQuery();
  });

  afterEach(() => {
    ResourceModel.find.mockReset();
  });

  describe('execute', () => {
    let resourceIds;

    beforeEach(() => {
      resourceIds = ['1', '2', '3'];
    });

    it('should return resources parallel to resource IDs parameter', async () => {
      when(ResourceModel.find)
        .calledWith({
          _id: { $in: resourceIds },
          slug: { $ne: null },
        })
        .mockReturnValue([{ id: '3' }, { id: '1' }, { id: '2' }]);
      const expectedResources = [{ id: '1' }, { id: '2' }, { id: '3' }];

      const resources = await query.execute(resourceIds);

      expect(resources).toEqual(expectedResources);
    });
  });
});
