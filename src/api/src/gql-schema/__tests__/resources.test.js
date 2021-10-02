const { when } = require('jest-when');
const { resolvers } = require('../resources');

describe('resources resolvers', () => {
  let resourcesDataSource;
  let usersDataSource;
  let context;

  beforeEach(() => {
    resourcesDataSource = {
      search: jest.fn(),
    };
    usersDataSource = {
      getById: jest.fn(),
    };
    context = {
      dataSources: {
        resources: resourcesDataSource,
        users: usersDataSource,
      },
    };
  });

  describe('resources query', () => {
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
        items: [{ id: 'resource123' }],
        totalCount: 1,
      };
      when(resourcesDataSource.search)
        .calledWith(search, { offset, limit })
        .mockReturnValue(expected);

      const actual = resolvers.Query.resources(
        null,
        { search, offset, limit },
        context
      );

      expect(expected).toBe(actual);
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

  describe('resource slug query', () => {
    let slug;

    beforeEach(() => {
      slug = 'resource-name123';
    });

    it('should return resource', () => {
      const expected = { slug };
      resourcesDataSource.getBySlug = () => expected;

      const actual = resolvers.Query.resourceBySlug(null, { slug }, context);

      expect(expected).toBe(actual);
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
      const expected = { id: userId };
      when(usersDataSource.getById)
        .calledWith(userId)
        .mockReturnValue(expected);

      const actual = resolvers.Resource.createdBy(
        { createdBy: userId },
        null,
        context
      );

      expect(actual).toBe(expected);
    });
  });
});
