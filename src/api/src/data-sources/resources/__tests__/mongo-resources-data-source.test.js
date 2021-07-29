const MongoResourcesDataSource = require('../mongo-resources-data-source');
const { AuthenticationError } = require('apollo-server');
const { Resource } = require('../../../mongoose/models/resource');
const slugify = require('../../../services/slugify');

jest.mock('../../../mongoose/models/resource');
jest.mock('../../../services/slugify');

describe('MongoResourcesDataSource', () => {
  let mongoResourcesDataSource;

  beforeEach(() => {
    Resource.mockReset();
    Resource.find.mockReset();
    Resource.exists.mockReset();
    Resource.create.mockReset();

    slugify.mockReset();

    mongoResourcesDataSource = new MongoResourcesDataSource();
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

  describe('search', () => {
    const query = 'resource-name';

    it('should return resources if successful', async () => {
      const expected = [{ _id: '123123' }];
      Resource.find.mockReturnValue(expected);

      const actual = await mongoResourcesDataSource.search(query);

      expect(actual).toBe(expected);
    });

    it('should call find with query', async () => {
      await mongoResourcesDataSource.search(query);

      expect(Resource.find.mock.calls[0][0]).toEqual({
        name: { $regex: query, $options: 'i' },
      });
    });

    it('should throw if query fails', async () => {
      Resource.find.mockImplementation(() => {
        throw new Error();
      });

      await expect(async () => {
        await mongoResourcesDataSource.search(query);
      }).rejects.toThrow();
    });

    it('should skip resources if skip requested', async () => {
      const expectedSkip = 10;
      const mockSkip = jest.fn();
      Resource.find.mockReturnValue({
        skip: mockSkip,
      });

      await mongoResourcesDataSource.search(query, expectedSkip);

      expect(mockSkip.mock.calls[0][0]).toBe(expectedSkip);
    });

    it('should limit resources if limit requested', async () => {
      const expectedLimit = 10;
      const mockLimit = jest.fn();
      Resource.find.mockReturnValue({
        limit: mockLimit,
      });

      await mongoResourcesDataSource.search(query, 0, expectedLimit);

      expect(mockLimit.mock.calls[0][0]).toBe(expectedLimit);
    });
  });

  describe('getByIds', () => {
    const ids = ['123', '456', '789'];
    const search = 'query';

    it('should return resources if successful', async () => {
      const expected = [{ _id: '123' }];
      Resource.find.mockReturnValue(expected);

      const actual = await mongoResourcesDataSource.getByIds(ids, search);

      expect(actual).toBe(expected);
    });

    it('should call find with query', async () => {
      await mongoResourcesDataSource.getByIds(ids, search);

      expect(Resource.find.mock.calls[0][0]).toEqual({
        _id: { $in: ids },
        name: { $regex: search, $options: 'i' },
      });
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
        mongoResourcesDataSource.user = { uid: userId };
      });

      it('should throw resource exists error if name exists', async () => {
        Resource.exists.mockReturnValue(true);

        await expect(async () => {
          await mongoResourcesDataSource.create(name, link);
        }).rejects.toThrow('Resource already exists.');
      });

      it('should throw resource slug exists error if slug already exists', async () => {
        Resource.exists.mockReturnValueOnce(false);
        Resource.exists.mockReturnValueOnce(true);

        await expect(async () => {
          await mongoResourcesDataSource.create(name, link);
        }).rejects.toThrow('Resource slug already exists.');
      });

      it('should throw if request fails', async () => {
        Resource.create.mockImplementation(() => {
          throw new Error();
        });

        await expect(async () => {
          await mongoResourcesDataSource.create(name, link);
        }).rejects.toThrow();
      });

      it('should return created resource if successful', async () => {
        slugify.mockReturnValue(slug);
        const expected = { name, slug, link };
        Resource.create.mockReturnValue(expected);

        const actual = await mongoResourcesDataSource.create(name, link);

        expect(actual).toBe(expected);
      });

      it('should call create if successful', async () => {
        slugify.mockReturnValue(slug);
        const expected = { name, slug, link, createdBy: userId };

        await mongoResourcesDataSource.create(name, link);

        expect(Resource.create.mock.calls[0][0]).toEqual(expected);
      });
    });
  });
});
