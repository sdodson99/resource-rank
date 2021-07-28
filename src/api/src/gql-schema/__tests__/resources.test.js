const { resolvers } = require('../resources');

describe('resources resolvers', () => {
  let resourcesDataSource;
  let usersDataSource;
  let context;

  beforeEach(() => {
    resourcesDataSource = {};
    usersDataSource = {};
    context = {
      dataSources: {
        resources: resourcesDataSource,
        usersDataSource,
      },
    };
  });

  describe('resources query', () => {
    let search;

    beforeEach(() => {
      search = 'search123';
    });

    it('should return search result', () => {
      const expected = [{ id: 'resource123' }];
      resourcesDataSource.search = () => expected;

      const actual = resolvers.Query.resources(null, { search }, context);

      expect(expected).toBe(actual);
    });

    it('should execute search', () => {
      resourcesDataSource.search = jest.fn();

      resolvers.Query.resources(null, { search }, context);

      expect(resourcesDataSource.search.mock.calls[0][0]).toBe(search);
    });
  });

  describe('resource query', () => {
    let id;

    beforeEach(() => {
      id = 'resource123';
    });

    it('should return resource', () => {
      const expected = { id };
      resourcesDataSource.getById = () => expected;

      const actual = resolvers.Query.resource(null, { id }, context);

      expect(expected).toBe(actual);
    });

    it('should get resource for id', () => {
      resourcesDataSource.getById = jest.fn();

      resolvers.Query.resource(null, { id }, context);

      expect(resourcesDataSource.getById.mock.calls[0][0]).toBe(id);
    });
  });

  describe('resource exists query', () => {
    let name;

    beforeEach(() => {
      name = 'resource';
    });

    it('should return exists result', () => {
      const expected = true;
      resourcesDataSource.nameExists = () => expected;

      const actual = resolvers.Query.resourceExists(null, { name }, context);

      expect(expected).toBe(actual);
    });

    it('should execute for resource name', () => {
      resourcesDataSource.nameExists = jest.fn();

      resolvers.Query.resourceExists(null, { name }, context);

      expect(resourcesDataSource.nameExists.mock.calls[0][0]).toBe(name);
    });
  });

  describe('create resource mutation', () => {
    let name;
    let link;

    beforeEach(() => {
      name = 'resource';
      link = 'resource.com';
    });

    it('should return created resource', () => {
      const expected = { name, link };
      resourcesDataSource.create = () => expected;

      const actual = resolvers.Mutation.createResource(
        null,
        { name, link },
        context
      );

      expect(actual).toBe(expected);
    });

    it('should create rating', () => {
      resourcesDataSource.create = jest.fn();

      resolvers.Mutation.createResource(null, { name, link }, context);

      expect(resourcesDataSource.create.mock.calls[0][0]).toBe(name);
      expect(resourcesDataSource.create.mock.calls[0][1]).toBe(link);
    });
  });

  describe('resource createdBy resolver', () => {
    let userId;

    beforeEach(() => {
      userId = 'user123';
    });

    it('should return user for resource', () => {
      const expected = { userId };
      usersDataSource.getUser = () => expected;

      const actual = resolvers.Resource.createdBy(
        { createdBy: userId },
        null,
        context
      );

      expect(actual).toBe(expected);
    });

    it('should get user for user id', () => {
      usersDataSource.getUser = jest.fn();

      resolvers.Resource.createdBy({ createdBy: userId }, null, context);

      expect(usersDataSource.getUser.mock.calls[0][0]).toBe(userId);
    });
  });
});