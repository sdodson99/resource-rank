const MongoResourcesDataSource = require('../mongo-resources-data-source');
const { AuthenticationError } = require('apollo-server');
const { Resource } = require('../../../mongoose/models/resource');
const slugify = require('../../../services/slugify');
const validateResource = require('../../../validators/resource');
const { when } = require('jest-when');

jest.mock('../../../mongoose/models/resource');
jest.mock('../../../services/slugify');
jest.mock('../../../validators/resource');

describe('MongoResourcesDataSource', () => {
  let mongoResourcesDataSource;

  beforeEach(() => {
    mongoResourcesDataSource = new MongoResourcesDataSource();
  });

  afterEach(() => {
    Resource.mockReset();
    Resource.find.mockReset();
    Resource.paginate.mockReset();
    Resource.findOne.mockReset();
    Resource.exists.mockReset();
    Resource.create.mockReset();

    slugify.mockReset();
    validateResource.mockReset();
  });

  describe('initialize', () => {
    it('should set user from config', () => {
      const expected = { name: 'some-user' };
      const config = { context: { user: expected } };

      mongoResourcesDataSource.initialize(config);

      const actual = mongoResourcesDataSource.user;
      expect(actual).toBe(expected);
    });
  });

  describe('getById', () => {
    const resourceId = '123123';

    it('should return resource if resource found', async () => {
      const expected = { _id: resourceId };
      Resource.find.mockReturnValue([expected]);

      const actual = await mongoResourcesDataSource.getById(resourceId);

      expect(actual).toBe(expected);
    });

    it('should return null if resource not found', async () => {
      Resource.find.mockReturnValue([]);

      const actual = await mongoResourcesDataSource.getById(resourceId);

      expect(actual).toBeNull();
    });

    it('should throw if resource query fails', async () => {
      Resource.find.mockImplementation(() => {
        throw new Error();
      });

      await expect(async () => {
        await mongoResourcesDataSource.getById(resourceId);
      }).rejects.toThrow();
    });
  });

  describe('getBySlug', () => {
    const slug = 'resource-name';

    it('should return resource if resource slug found', async () => {
      const expected = { slug };
      Resource.findOne.mockReturnValue(expected);

      const actual = await mongoResourcesDataSource.getBySlug(slug);

      expect(actual).toBe(expected);
    });

    it('should return null if resource slug not found', async () => {
      Resource.findOne.mockReturnValue(null);

      const actual = await mongoResourcesDataSource.getBySlug(slug);

      expect(actual).toBeNull();
    });

    it('should throw if resource slug query fails', async () => {
      Resource.findOne.mockImplementation(() => {
        throw new Error();
      });

      await expect(async () => {
        await mongoResourcesDataSource.getBySlug(slug);
      }).rejects.toThrow();
    });
  });

  describe('search', () => {
    let query;
    let offset;
    let limit;
    let excludeIds;

    beforeEach(() => {
      query = 'some-resource';
      offset = 10;
      limit = 5;
      excludeIds = ['1'];
    });

    it('should return paginated resources if query succeeds', async () => {
      const expected = {
        items: [{ id: '123' }, { id: '456' }],
        totalCount: 1,
      };
      when(Resource.paginate)
        .calledWith(
          {
            _id: { $nin: excludeIds },
            name: { $regex: query, $options: 'i' },
            slug: { $ne: null },
          },
          {
            offset,
            limit,
            sort: { verified: -1 },
          }
        )
        .mockReturnValue({
          docs: [{ id: '123' }, { id: '456' }],
          total: 1,
        });

      const actual = await mongoResourcesDataSource.search(query, {
        offset,
        limit,
        excludeIds,
      });

      expect(actual).toEqual(expected);
    });

    it('should return default paginated resources when no options provided', async () => {
      const expected = {
        items: [{ id: '123' }, { id: '456' }],
        totalCount: 1,
      };
      when(Resource.paginate)
        .calledWith(
          {
            _id: { $nin: [] },
            name: { $regex: '', $options: 'i' },
            slug: { $ne: null },
          },
          {
            offset: 0,
            limit: 20,
            sort: { verified: -1 },
          }
        )
        .mockReturnValue({
          docs: [{ id: '123' }, { id: '456' }],
          total: 1,
        });

      const actual = await mongoResourcesDataSource.search();

      expect(actual).toEqual(expected);
    });

    it('should throw if query fails', async () => {
      Resource.paginate.mockImplementation(() => {
        throw new Error();
      });

      await expect(async () => {
        await mongoResourcesDataSource.search(query);
      }).rejects.toThrow();
    });
  });

  describe('getByIds', () => {
    const ids = ['123', '456', '789'];
    const search = 'query';

    it('should return resources if successful', async () => {
      const expected = [{ _id: '123' }];
      when(Resource.find)
        .calledWith({
          _id: { $in: ids },
          name: { $regex: search, $options: 'i' },
          slug: { $ne: null },
        })
        .mockReturnValue(expected);

      const actual = await mongoResourcesDataSource.getByIds(ids, search);

      expect(actual).toBe(expected);
    });

    it('should return resources for default search when no search provided', async () => {
      const expected = [{ _id: '123' }];
      when(Resource.find)
        .calledWith({
          _id: { $in: ids },
          name: { $regex: '', $options: 'i' },
          slug: { $ne: null },
        })
        .mockReturnValue(expected);

      const actual = await mongoResourcesDataSource.getByIds(ids);

      expect(actual).toBe(expected);
    });

    it('should throw if query fails', async () => {
      Resource.find.mockImplementation(() => {
        throw new Error();
      });

      await expect(async () => {
        await mongoResourcesDataSource.getByIds(ids, search);
      }).rejects.toThrow();
    });
  });

  describe('nameExists', () => {
    const name = 'resource-name';

    it('should return result if successful', async () => {
      const expected = true;
      Resource.exists.mockReturnValue(expected);

      const actual = await mongoResourcesDataSource.nameExists(name);

      expect(actual).toBe(expected);
    });

    it('should throw if request fails', async () => {
      Resource.exists.mockImplementation(() => {
        throw new Error();
      });

      await expect(async () => {
        await mongoResourcesDataSource.nameExists(name);
      }).rejects.toThrow();
    });

    it('should call exists if successful', async () => {
      await mongoResourcesDataSource.nameExists(name);

      expect(Resource.exists.mock.calls[0][0]).toEqual({ name });
    });
  });

  describe('create', () => {
    const name = 'resource name';
    const link = 'test.com';
    const slug = 'resource-name';

    describe('with unauthenticated user', () => {
      it('should throw authentication error', async () => {
        await expect(async () => {
          await mongoResourcesDataSource.create(name, link);
        }).rejects.toThrow(AuthenticationError);
      });
    });

    describe('with authenticated user', () => {
      const userId = 'user123';

      beforeEach(() => {
        mongoResourcesDataSource.user = { id: userId };
      });

      it('should throw resource validation error if resource is invalid', async () => {
        const code = 'RESOURCE_VALIDATION_ERROR';
        const message = 'error message';
        validateResource.mockReturnValue({
          isValid: false,
          message,
        });

        try {
          await mongoResourcesDataSource.create(name);

          fail();
        } catch (error) {
          expect(error.message).toBe(message);
          expect(error.extensions.code).toBe(code);
        }
      });

      it('should throw resource exists error if name exists', async () => {
        validateResource.mockReturnValue({ isValid: true });
        Resource.exists.mockReturnValue(true);

        await expect(async () => {
          await mongoResourcesDataSource.create(name, link);
        }).rejects.toThrow('Resource already exists.');
      });

      it('should throw resource slug exists error if slug already exists', async () => {
        validateResource.mockReturnValue({ isValid: true });
        Resource.exists.mockReturnValueOnce(false);
        Resource.exists.mockReturnValueOnce(true);

        await expect(async () => {
          await mongoResourcesDataSource.create(name, link);
        }).rejects.toThrow('Resource slug already exists.');
      });

      it('should throw if request fails', async () => {
        validateResource.mockReturnValue({ isValid: true });
        Resource.create.mockImplementation(() => {
          throw new Error();
        });

        await expect(async () => {
          await mongoResourcesDataSource.create(name, link);
        }).rejects.toThrow();
      });

      it('should return created resource if successful', async () => {
        validateResource.mockReturnValue({ isValid: true });
        slugify.mockReturnValue(slug);
        const expected = { name, slug, link };
        Resource.create.mockReturnValue(expected);

        const actual = await mongoResourcesDataSource.create(name, link);

        expect(actual).toBe(expected);
      });

      it('should call create if successful', async () => {
        validateResource.mockReturnValue({ isValid: true });
        slugify.mockReturnValue(slug);
        const expected = { name, slug, link, createdBy: userId };

        await mongoResourcesDataSource.create(name, link);

        expect(Resource.create.mock.calls[0][0]).toEqual(expected);
      });
    });
  });
});
