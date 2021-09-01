const { when } = require('jest-when');
const { resolvers } = require('../topics');

describe('topics resolvers', () => {
  let topicsDataSource;
  let usersDataSource;
  let context;

  beforeEach(() => {
    topicsDataSource = {
      search: jest.fn(),
    };
    usersDataSource = {};
    context = {
      dataSources: {
        topics: topicsDataSource,
        usersDataSource,
      },
    };
  });

  describe('topics query', () => {
    let search;
    let offset;
    let limit;

    beforeEach(() => {
      search = 'search123';
      offset = 10;
      limit = 5;
    });

    it('should return search result', () => {
      const expected = {
        items: [{ id: 'topic123' }],
        totalCount: 1,
      };
      when(topicsDataSource.search)
        .calledWith(search, { offset, limit })
        .mockReturnValue(expected);

      const actual = resolvers.Query.topics(
        null,
        { search, offset, limit },
        context
      );

      expect(expected).toBe(actual);
    });
  });

  describe('topic query', () => {
    let id;

    beforeEach(() => {
      id = 'topic123';
    });

    it('should return topic', () => {
      const expected = { id };
      topicsDataSource.getById = () => expected;

      const actual = resolvers.Query.topic(null, { id }, context);

      expect(expected).toBe(actual);
    });

    it('should get topic for id', () => {
      topicsDataSource.getById = jest.fn();

      resolvers.Query.topic(null, { id }, context);

      expect(topicsDataSource.getById.mock.calls[0][0]).toBe(id);
    });
  });

  describe('topic slug query', () => {
    let slug;

    beforeEach(() => {
      slug = 'topic-name123';
    });

    it('should return topic', () => {
      const expected = { slug };
      topicsDataSource.getBySlug = () => expected;

      const actual = resolvers.Query.topicBySlug(null, { slug }, context);

      expect(expected).toBe(actual);
    });
  });

  describe('topic exists query', () => {
    let name;

    beforeEach(() => {
      name = 'topic';
    });

    it('should return exists result', () => {
      const expected = true;
      topicsDataSource.nameExists = () => expected;

      const actual = resolvers.Query.topicExists(null, { name }, context);

      expect(expected).toBe(actual);
    });

    it('should execute for topic name', () => {
      topicsDataSource.nameExists = jest.fn();

      resolvers.Query.topicExists(null, { name }, context);

      expect(topicsDataSource.nameExists.mock.calls[0][0]).toBe(name);
    });
  });

  describe('create topic mutation', () => {
    let name;

    beforeEach(() => {
      name = 'topic';
    });

    it('should return created topic', () => {
      const expected = { name };
      topicsDataSource.create = () => expected;

      const actual = resolvers.Mutation.createTopic(null, { name }, context);

      expect(actual).toBe(expected);
    });

    it('should create rating', () => {
      topicsDataSource.create = jest.fn();

      resolvers.Mutation.createTopic(null, { name }, context);

      expect(topicsDataSource.create.mock.calls[0][0]).toBe(name);
    });
  });

  describe('topic resources resolver', () => {
    let id;

    beforeEach(() => {
      id = 'topic123';
    });

    it('should return empty if resources is null', () => {
      const topicResources = resolvers.Topic.resources({ id });

      expect(topicResources).toHaveLength(0);
    });

    it('should return topic resources if has resources', () => {
      const resources = [
        { resource: 'resource123', createdBy: 'user123' },
        { resource: 'resource456', createdBy: 'user456' },
      ];
      const expected = [
        { topicId: id, resourceId: 'resource123', createdBy: 'user123' },
        { topicId: id, resourceId: 'resource456', createdBy: 'user456' },
      ];

      const actual = resolvers.Topic.resources({ id, resources });

      expect(actual).toEqual(expected);
    });

    it('should exclude topic resources that have no resource', () => {
      const resources = [
        { resource: 'resource123', createdBy: 'user123' },
        { createdBy: 'user456' },
      ];
      const expected = [
        {
          topicId: id,
          resourceId: 'resource123',
          createdBy: 'user123',
        },
      ];

      const actual = resolvers.Topic.resources({ id, resources });

      expect(actual).toEqual(expected);
    });
  });

  describe('topic createdBy resolver', () => {
    let userId;

    beforeEach(() => {
      userId = 'user123';
    });

    it('should return user for topic', () => {
      const expected = { userId };
      usersDataSource.getUser = () => expected;

      const actual = resolvers.Topic.createdBy(
        { createdBy: userId },
        null,
        context
      );

      expect(actual).toBe(expected);
    });

    it('should get user for user id', () => {
      usersDataSource.getUser = jest.fn();

      resolvers.Topic.createdBy({ createdBy: userId }, null, context);

      expect(usersDataSource.getUser.mock.calls[0][0]).toBe(userId);
    });
  });
});
