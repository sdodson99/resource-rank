const { when } = require('jest-when');
const { resolvers } = require('../topic-resources');

describe('topic resources resolvers', () => {
  let topicId;
  let resourceId;
  let offset;
  let limit;
  let ratingId;
  let userId;
  let resourceSearch;
  let topicsDataSource;
  let resourcesDataSource;
  let ratingsDataSource;
  let usersDataSource;
  let context;

  beforeEach(() => {
    topicId = 'topic123';
    resourceId = 'resource123';
    offset = 5;
    limit = 10;
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
    };
    usersDataSource = {
      getUser: jest.fn(),
    };
    context = {
      dataSources: {
        topics: topicsDataSource,
        resources: resourcesDataSource,
        ratings: ratingsDataSource,
        usersDataSource,
      },
    };
  });

  describe('topic resource listing query', () => {
    it('should return result with topic resource ids if topic has resources', async () => {
      const expected = {
        resourceIds: ['resource123', 'resource456'],
        topicId,
        resourceSearch,
        offset,
        limit,
      };
      when(topicsDataSource.getById)
        .calledWith(topicId)
        .mockReturnValue({
          resources: [{ resource: 'resource123' }, { resource: 'resource456' }],
        });

      const actual = await resolvers.Query.topicResources(
        null,
        { topicId, resourceSearch, offset, limit },
        context
      );

      expect(actual).toEqual(expected);
    });

    it('should return result with empty topic resources ids if topic not found', async () => {
      const expected = {
        resourceIds: [],
        topicId,
        resourceSearch,
        offset,
        limit,
      };
      when(topicsDataSource.getById).calledWith(topicId).mockReturnValue(null);

      const actual = await resolvers.Query.topicResources(
        null,
        { topicId, resourceSearch, offset, limit },
        context
      );

      expect(actual).toEqual(expected);
    });
  });

  describe('topic resource query', () => {
    it('should return topic resource', () => {
      const expected = { topicId, resourceId };

      const actual = resolvers.Query.topicResource(null, {
        topicId,
        resourceId,
      });

      expect(actual).toEqual(expected);
    });
  });

  describe('topic resource by slug query', () => {
    it('should return topic resource', async () => {
      const expected = {
        topicId: '123',
        resourceId: '456',
        topic: {
          id: '123',
          slug: 'topic-name',
        },
        resource: {
          id: '456',
          slug: 'resource-name',
        },
      };
      topicsDataSource.getBySlug.mockReturnValue({
        id: '123',
        slug: 'topic-name',
      });
      resourcesDataSource.getBySlug.mockReturnValue({
        id: '456',
        slug: 'resource-name',
      });

      const actual = await resolvers.Query.topicResourceBySlug(
        null,
        {
          topicId,
          resourceId,
        },
        context
      );

      expect(actual).toEqual(expected);
    });

    it('should throw topic resource not found error when topic not found', async () => {
      topicsDataSource.getBySlug.mockReturnValue(null);

      await expect(async () => {
        await resolvers.Query.topicResourceBySlug(
          null,
          {
            topicId,
            resourceId,
          },
          context
        );
      }).rejects.toThrow('Topic resource not found.');
    });

    it('should throw topic resource not found error when resource not found', async () => {
      topicsDataSource.getBySlug.mockReturnValue({});
      resourcesDataSource.getBySlug.mockReturnValue(null);

      await expect(async () => {
        await resolvers.Query.topicResourceBySlug(
          null,
          {
            topicId,
            resourceId,
          },
          context
        );
      }).rejects.toThrow('Topic resource not found.');
    });
  });

  describe('available resources query', () => {
    let offset;
    let limit;

    beforeEach(() => {
      offset = 5;
      limit = 5;

      when(resourcesDataSource.search)
        .calledWith(resourceSearch, offset, limit)
        .mockReturnValue([
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
        ]);
    });

    it('should return available resources for topic', async () => {
      const expected = [
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
      ];
      when(topicsDataSource.getById)
        .calledWith(topicId)
        .mockReturnValue({
          resources: [
            {
              resource: 'resource123',
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

  describe('topic resource topic resolver', () => {
    it('should return topic for topic id', () => {
      const expected = { id: topicId };
      when(topicsDataSource.getById)
        .calledWith(topicId)
        .mockReturnValue(expected);

      const actual = resolvers.TopicResource.topic({ topicId }, null, context);

      expect(actual).toBe(expected);
    });
  });

  describe('topic resource resource resolver', () => {
    it('should return resource for resource id', () => {
      const expected = { id: resourceId };
      when(resourcesDataSource.getById)
        .calledWith(resourceId)
        .mockReturnValue(expected);

      const actual = resolvers.TopicResource.resource(
        { resourceId },
        null,
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

      const actual = resolvers.TopicResource.ratingList(
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

      const actual = resolvers.TopicResource.createdBy(
        { createdBy: userId },
        null,
        context
      );

      expect(actual).toBe(expected);
    });
  });

  describe('topic resource listing items resolver', () => {
    let topicResource;

    beforeEach(() => {
      topicResource = {
        resource: {
          _id: resourceId,
          createdBy: userId,
        },
        topicId,
        resourceId,
        createdBy: userId,
      };
    });

    it('should return paginated topic resources for search', async () => {
      const expected = [topicResource, topicResource, topicResource];
      const resourceIds = ['1', '2', '3', '4', '5'];
      const paginatedResourceIds = ['2', '3', '4'];
      when(resourcesDataSource.getByIds)
        .calledWith(paginatedResourceIds, resourceSearch)
        .mockReturnValue([
          {
            _id: resourceId,
            createdBy: userId,
          },
          {
            _id: resourceId,
            createdBy: userId,
          },
          {
            _id: resourceId,
            createdBy: userId,
          },
        ]);

      const actual = await resolvers.TopicResourceListing.items(
        {
          resourceIds,
          topicId,
          resourceSearch,
          offset: 1,
          limit: 3,
        },
        null,
        context
      );

      expect(actual).toEqual(expected);
    });

    it('should return paginated topic resources for default pagination options', async () => {
      const expected = [topicResource, topicResource, topicResource];
      const resourceIds = ['1', '2', '3', '4', '5'];
      const paginatedResourceIds = ['1', '2', '3', '4', '5'];
      when(resourcesDataSource.getByIds)
        .calledWith(paginatedResourceIds, resourceSearch)
        .mockReturnValue([
          {
            _id: resourceId,
            createdBy: userId,
          },
          {
            _id: resourceId,
            createdBy: userId,
          },
          {
            _id: resourceId,
            createdBy: userId,
          },
        ]);

      const actual = await resolvers.TopicResourceListing.items(
        {
          resourceIds,
          topicId,
          resourceSearch,
        },
        null,
        context
      );

      expect(actual).toEqual(expected);
    });
  });

  describe('topic resource listing total count resolver', () => {
    it('should return resource count', () => {
      const expected = 3;
      const resourceIds = ['1', '2', '3'];

      const actual = resolvers.TopicResourceListing.totalCount({ resourceIds });

      expect(actual).toBe(expected);
    });
  });
});
