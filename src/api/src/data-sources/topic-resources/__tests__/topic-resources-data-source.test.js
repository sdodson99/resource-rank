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

  describe('getBySlug', () => {
    let topicSlug;
    let resourceSlug;

    beforeEach(() => {
      topicSlug = 'topic-name';
      resourceSlug = 'resource-name';
    });

    it('should return topic resource', async () => {
      const expected = {
        topic: {
          id: '123',
          slug: topicSlug,
        },
        resource: {
          id: '456',
          slug: resourceSlug,
        },
      };
      when(topicsDataSource.getBySlug)
        .calledWith(topicSlug)
        .mockReturnValue(expected.topic);
      when(resourcesDataSource.getBySlug)
        .calledWith(resourceSlug)
        .mockReturnValue(expected.resource);

      const actual = await topicResourcesDataSource.getBySlug(
        topicSlug,
        resourceSlug
      );

      expect(actual).toEqual(expected);
    });

    it('should throw topic resource not found error when topic not found', async () => {
      when(topicsDataSource.getBySlug)
        .calledWith(topicSlug)
        .mockReturnValue(null);
      when(resourcesDataSource.getBySlug)
        .calledWith(resourceSlug)
        .mockReturnValue({});

      await expect(async () => {
        await topicResourcesDataSource.getBySlug(topicSlug, resourceSlug);
      }).rejects.toThrow('Topic resource not found.');
    });

    it('should throw topic resource not found error when resource not found', async () => {
      when(topicsDataSource.getBySlug)
        .calledWith(topicSlug)
        .mockReturnValue({});
      when(resourcesDataSource.getBySlug)
        .calledWith(resourceSlug)
        .mockReturnValue(null);

      await expect(async () => {
        await topicResourcesDataSource.getBySlug(topicSlug, resourceSlug);
      }).rejects.toThrow('Topic resource not found.');
    });
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
            topic: {
              id: topicId,
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
          },
        ],
        totalCount: 2,
      };
      topicsDataSource.getById.mockReturnValue({
        id: topicId,
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

  describe('searchAvailableResources', () => {
    let search;
    let offset;
    let limit;

    let userId;

    beforeEach(() => {
      search = 'search';
      offset = 5;
      limit = 5;

      userId = 'user123';

      when(resourcesDataSource.search)
        .calledWith(search, { offset, limit })
        .mockReturnValue({
          items: [
            {
              id: 'resource123',
              name: 'resource1',
              link: 'resource1.com',
              createdBy: userId,
              verified: true,
            },
            {
              id: 'resource456',
              name: 'resource2',
              link: 'resource2.com',
              createdBy: userId,
              verified: false,
            },
          ],
          totalCount: 2,
        });
    });

    it('should return available resources for topic', async () => {
      const expected = {
        items: [
          {
            resource: {
              id: 'resource123',
              name: 'resource1',
              link: 'resource1.com',
              createdBy: userId,
              verified: true,
            },
            alreadyAdded: true,
          },
          {
            resource: {
              id: 'resource456',
              name: 'resource2',
              link: 'resource2.com',
              createdBy: userId,
              verified: false,
            },
            alreadyAdded: false,
          },
        ],
        totalCount: 2,
      };
      when(topicsDataSource.getById)
        .calledWith(topicId)
        .mockReturnValue({
          resources: [
            {
              resource: 'resource123',
            },
            {
              resource: 'other456',
            },
          ],
        });

      const actual = await topicResourcesDataSource.searchAvailableResources(
        topicId,
        {
          search,
          offset,
          limit,
        }
      );

      expect(actual).toEqual(expected);
    });

    it('should throw error if topic not found', async () => {
      when(topicsDataSource.getById).calledWith(topicId).mockReturnValue(null);
      resourcesDataSource.search.mockReturnValue({ items: [] });

      await expect(async () => {
        await topicResourcesDataSource.searchAvailableResources(topicId);
      }).rejects.toThrow('Topic not found.');
    });
  });
});
