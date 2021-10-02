const { when } = require('jest-when');
const { resolvers } = require('../topics');

describe('topics resolvers', () => {
  let topicsDataSource;
  let topicResourcesDataSource;
  let usersDataSource;
  let context;

  beforeEach(() => {
    topicsDataSource = {
      search: jest.fn(),
    };
    usersDataSource = {
      getById: jest.fn(),
    };
    topicResourcesDataSource = {
      searchByTopic: jest.fn(),
    };

    context = {
      dataSources: {
        topics: topicsDataSource,
        topicResources: topicResourcesDataSource,
        users: usersDataSource,
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
    let topic;
    let searchOptions;

    beforeEach(() => {
      topic = { id: 'topic123' };
      searchOptions = {};
    });

    it('should return topic resources data source result', () => {
      const expected = {
        items: [],
        totalCount: 0,
      };
      when(topicResourcesDataSource.searchByTopic)
        .calledWith(topic, searchOptions)
        .mockReturnValue(expected);

      const actual = resolvers.Topic.resources(
        topic,
        { searchOptions },
        context
      );

      expect(actual).toBe(expected);
    });
  });

  describe('topic createdBy resolver', () => {
    let userId;

    beforeEach(() => {
      userId = 'user123';
    });

    it('should return user for topic', () => {
      const expected = { userId };
      when(usersDataSource.getById)
        .calledWith(userId)
        .mockReturnValue(expected);

      const actual = resolvers.Topic.createdBy(
        { createdBy: userId },
        null,
        context
      );

      expect(actual).toBe(expected);
    });
  });
});
