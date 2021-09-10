const { when } = require('jest-when');
const TopicResourcesDataSource = require('../topic-resources-data-source');

describe('TopicResourcesDataSource', () => {
  let topicResourcesDataSource;

  let topicId;
  let topicsDataSource;
  let resourcesDataSource;
  let ratingsDataSource;

  beforeEach(() => {
    topicId = 'topic123';
    topicsDataSource = {
      getById: jest.fn(),
      getBySlug: jest.fn(),
      addResource: jest.fn(),
    };
    resourcesDataSource = {
      getById: jest.fn(),
      getBySlug: jest.fn(),
      getByIds: jest.fn(),
      search: jest.fn(),
    };
    ratingsDataSource = {
      getAllForTopicResource: jest.fn(),
      getAllForManyTopicResources: jest.fn(),
    };

    topicResourcesDataSource = new TopicResourcesDataSource(
      topicsDataSource,
      resourcesDataSource,
      ratingsDataSource
    );
  });

  describe('searchByTopicId', () => {
    let searchOptions;

    beforeEach(() => {
      searchOptions = {
        search: 'test',
        offset: 0,
        limit: 10,
      };
    });

    it('should return result with paginated, filtered, and sorted topic resources if topic has resources', async () => {
      const expected = {
        items: [
          {
            averageRating: 0,
            createdBy: undefined,
            resource: {
              id: 'resource456',
            },
            resourceId: undefined,
            topic: {
              resources: [
                {
                  resource: {
                    id: 'resource123',
                  },
                },
                {
                  resource: {
                    id: 'resource456',
                  },
                },
              ],
            },
            topicId: 'topic123',
          },
        ],
        totalCount: 2,
      };
      topicsDataSource.getById.mockReturnValue({
        resources: [
          {
            resource: {
              id: 'resource123',
            },
          },
          {
            resource: {
              id: 'resource456',
            },
          },
        ],
      });
      resourcesDataSource.getByIds.mockReturnValue([
        {
          id: 'resource123',
        },
        {
          id: 'resource456',
        },
      ]);
      ratingsDataSource.getAllForManyTopicResources.mockReturnValue([[], []]);

      const actual = await topicResourcesDataSource.searchByTopicId(topicId, {
        search: 'test',
        offset: 1,
        limit: 1,
      });

      expect(actual).toEqual(expected);
    });

    it('should return result with empty topic resources ids if topic not found', async () => {
      const expected = {
        items: [],
        totalCount: 0,
      };
      when(topicsDataSource.getById).calledWith(topicId).mockReturnValue(null);

      const actual = await topicResourcesDataSource.searchByTopicId(
        topicId,
        searchOptions
      );

      expect(actual).toEqual(expected);
    });

    it('should return result with empty topic resources ids if topic has no resources', async () => {
      const expected = {
        items: [],
        totalCount: 0,
      };
      when(topicsDataSource.getById).calledWith(topicId).mockReturnValue({});

      const actual = await topicResourcesDataSource.searchByTopicId(topicId);

      expect(actual).toEqual(expected);
    });
  });
});
