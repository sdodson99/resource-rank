const { when } = require('jest-when');
const { resolvers } = require('../topic-resources');

describe('topic resources resolvers', () => {
  let topicId;
  let resourceId;
  let ratingId;
  let userId;
  let resourceSearch;
  let topicsDataSource;
  let resourcesDataSource;
  let ratingsDataSource;
  let topicResourcesDataSource;
  let usersDataSource;
  let context;

  beforeEach(() => {
    topicId = 'topic123';
    resourceId = 'resource123';
    ratingId = 'rating123';
    userId = 'user123';
    resourceSearch = 'search123';
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
    topicResourcesDataSource = {
      searchByTopicId: jest.fn(),
      getBySlug: jest.fn(),
    };
    usersDataSource = {
      getUser: jest.fn(),
    };
    context = {
      dataSources: {
        topics: topicsDataSource,
        resources: resourcesDataSource,
        ratings: ratingsDataSource,
        topicResources: topicResourcesDataSource,
        usersDataSource,
      },
    };
  });

  describe('topic resource listing query', () => {
    it('should return topic resource data source result', async () => {
      const expected = {
        items: [{}],
        totalCount: 1,
      };
      const searchOptions = {
        search: 'test',
      };
      when(topicResourcesDataSource.searchByTopicId)
        .calledWith(topicId, searchOptions)
        .mockReturnValue(expected);

      const actual = await resolvers.Query.topicResources(
        null,
        { topicId, searchOptions },
        context
      );

      expect(actual).toEqual(expected);
    });
  });

  describe('topic resource by slug query', () => {
    let topicSlug;
    let resourceSlug;

    beforeEach(() => {
      topicSlug = 'topic-name';
      resourceSlug = 'resource-name';
    });

    it('should return topic resource', async () => {
      const expected = {};
      when(topicResourcesDataSource.getBySlug)
        .calledWith(topicSlug, resourceSlug)
        .mockReturnValue(expected);

      const actual = await resolvers.Query.topicResourceBySlug(
        null,
        {
          topicSlug,
          resourceSlug,
        },
        context
      );

      expect(actual).toEqual(expected);
    });
  });

  describe('available resources query', () => {
    let offset;
    let limit;

    beforeEach(() => {
      offset = 5;
      limit = 5;

      when(resourcesDataSource.search)
        .calledWith(resourceSearch, { offset, limit })
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

      const actual = await resolvers.Query.availableResources(
        null,
        {
          topicId,
          search: resourceSearch,
          offset,
          limit,
        },
        context
      );

      expect(actual).toEqual(expected);
    });

    it('should throw error if topic not found', async () => {
      when(topicsDataSource.getById).calledWith(topicId).mockReturnValue(null);

      await expect(async () => {
        await resolvers.Query.availableResources(
          null,
          {
            topicId,
            search: resourceSearch,
            offset,
            limit,
          },
          context
        );
      }).rejects.toThrow('Topic not found.');
    });
  });

  describe('create topic resource mutation', () => {
    it('should return result for adding topic resource', () => {
      const expected = true;
      when(topicsDataSource.addResource)
        .calledWith(topicId, resourceId)
        .mockReturnValue(expected);

      const actual = resolvers.Mutation.createTopicResource(
        null,
        { topicId, resourceId },
        context
      );

      expect(actual).toBe(expected);
    });
  });

  describe('topic resource rating list resolver', () => {
    it('should return rating list for topic resource id', () => {
      const expected = [{ id: ratingId }];
      when(ratingsDataSource.getAllForTopicResource)
        .calledWith(topicId, resourceId)
        .mockReturnValue(expected);

      const actual = resolvers.RootTopicResource.ratingList(
        { topicId, resourceId },
        null,
        context
      );

      expect(actual).toBe(expected);
    });
  });

  describe('topic resource created by resolver', () => {
    it('should return user for user id', () => {
      const expected = { id: userId };
      when(usersDataSource.getUser)
        .calledWith(userId)
        .mockReturnValue(expected);

      const actual = resolvers.RootTopicResource.createdBy(
        { createdBy: userId },
        null,
        context
      );

      expect(actual).toBe(expected);
    });
  });
});
