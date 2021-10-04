const { ResourcesDataSource } = require('../resources-data-source');
const { AuthenticationError } = require('apollo-server');
const { ResourceModel } = require('../../mongoose/resource-model');
const slugify = require('../../../../services/slugify');
const validateResource = require('../../../../validators/resource');
const { when } = require('jest-when');
const {
  createResourceByIdDataLoader,
} = require('../resource-by-id-data-loader');

jest.mock('../../mongoose/resource-model');
jest.mock('../../../../services/slugify');
jest.mock('../../../../validators/resource');
jest.mock('../resource-by-id-data-loader');

describe('ResourcesDataSource', () => {
  let resourcesDataSource;

  let mockResourceByIdDataLoader;

  beforeEach(() => {
    mockResourceByIdDataLoader = {
      load: jest.fn(),
    };
    createResourceByIdDataLoader.mockReturnValue(mockResourceByIdDataLoader);

    resourcesDataSource = new ResourcesDataSource();
  });

  afterEach(() => {
    ResourceModel.mockReset();
    ResourceModel.find.mockReset();
    ResourceModel.paginate.mockReset();
    ResourceModel.findOne.mockReset();
    ResourceModel.exists.mockReset();
    ResourceModel.create.mockReset();

    slugify.mockReset();
    validateResource.mockReset();
    createResourceByIdDataLoader.mockReset();
  });

  describe('initialize', () => {
    it('should set user from config', () => {
      const expected = { name: 'some-user' };
      const config = { context: { user: expected } };

      resourcesDataSource.initialize(config);

      const actual = resourcesDataSource.user;
      expect(actual).toBe(expected);
    });
  });

  describe('getById', () => {
    const resourceId = '123123';

    it('should return resource if resource found', async () => {
      const expected = { _id: resourceId };
      when(mockResourceByIdDataLoader.load)
        .calledWith(resourceId)
        .mockReturnValue(expected);

      const actual = await resourcesDataSource.getById(resourceId);

      expect(actual).toBe(expected);
    });

    it('should return null if resource not found', async () => {
      when(mockResourceByIdDataLoader.load)
        .calledWith(resourceId)
        .mockReturnValue(null);

      const actual = await resourcesDataSource.getById(resourceId);

      expect(actual).toBeNull();
    });

    it('should throw if resource query fails', async () => {
      when(mockResourceByIdDataLoader.load)
        .calledWith(resourceId)
        .mockImplementation(() => {
          throw new Error();
        });

      await expect(async () => {
        await resourcesDataSource.getById(resourceId);
      }).rejects.toThrow();
    });
  });

  describe('getBySlug', () => {
    const slug = 'resource-name';

    it('should return resource if resource slug found', async () => {
      const expected = { slug };
      ResourceModel.findOne.mockReturnValue(expected);

      const actual = await resourcesDataSource.getBySlug(slug);

      expect(actual).toBe(expected);
    });

    it('should return null if resource slug not found', async () => {
      ResourceModel.findOne.mockReturnValue(null);

      const actual = await resourcesDataSource.getBySlug(slug);

      expect(actual).toBeNull();
    });

    it('should throw if resource slug query fails', async () => {
      ResourceModel.findOne.mockImplementation(() => {
        throw new Error();
      });

      await expect(async () => {
        await resourcesDataSource.getBySlug(slug);
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
      when(ResourceModel.paginate)
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

      const actual = await resourcesDataSource.search(query, {
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
      when(ResourceModel.paginate)
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

      const actual = await resourcesDataSource.search();

      expect(actual).toEqual(expected);
    });

    it('should throw if query fails', async () => {
      ResourceModel.paginate.mockImplementation(() => {
        throw new Error();
      });

      await expect(async () => {
        await resourcesDataSource.search(query);
      }).rejects.toThrow();
    });
  });

  describe('getByIds', () => {
    const ids = ['123', '456', '789'];
    const search = 'query';

    it('should return resources if successful', async () => {
      const expected = [{ _id: '123' }];
      when(ResourceModel.find)
        .calledWith({
          _id: { $in: ids },
          name: { $regex: search, $options: 'i' },
          slug: { $ne: null },
        })
        .mockReturnValue(expected);

      const actual = await resourcesDataSource.getByIds(ids, search);

      expect(actual).toBe(expected);
    });

    it('should return resources for default search when no search provided', async () => {
      const expected = [{ _id: '123' }];
      when(ResourceModel.find)
        .calledWith({
          _id: { $in: ids },
          name: { $regex: '', $options: 'i' },
          slug: { $ne: null },
        })
        .mockReturnValue(expected);

      const actual = await resourcesDataSource.getByIds(ids);

      expect(actual).toBe(expected);
    });

    it('should throw if query fails', async () => {
      ResourceModel.find.mockImplementation(() => {
        throw new Error();
      });

      await expect(async () => {
        await resourcesDataSource.getByIds(ids, search);
      }).rejects.toThrow();
    });
  });

  describe('nameExists', () => {
    const name = 'resource-name';

    it('should return result if successful', async () => {
      const expected = true;
      ResourceModel.exists.mockReturnValue(expected);

      const actual = await resourcesDataSource.nameExists(name);

      expect(actual).toBe(expected);
    });

    it('should throw if request fails', async () => {
      ResourceModel.exists.mockImplementation(() => {
        throw new Error();
      });

      await expect(async () => {
        await resourcesDataSource.nameExists(name);
      }).rejects.toThrow();
    });

    it('should call exists if successful', async () => {
      await resourcesDataSource.nameExists(name);

      expect(ResourceModel.exists.mock.calls[0][0]).toEqual({ name });
    });
  });

  describe('create', () => {
    const name = 'resource name';
    const link = 'test.com';
    const slug = 'resource-name';

    describe('with unauthenticated user', () => {
      it('should throw authentication error', async () => {
        await expect(async () => {
          await resourcesDataSource.create(name, link);
        }).rejects.toThrow(AuthenticationError);
      });
    });

    describe('with authenticated user', () => {
      const userId = 'user123';

      beforeEach(() => {
        resourcesDataSource.user = { id: userId };
      });

      it('should throw resource validation error if resource is invalid', async () => {
        const code = 'RESOURCE_VALIDATION_ERROR';
        const message = 'error message';
        validateResource.mockReturnValue({
          isValid: false,
          message,
        });

        try {
          await resourcesDataSource.create(name);

          fail();
        } catch (error) {
          expect(error.message).toBe(message);
          expect(error.extensions.code).toBe(code);
        }
      });

      it('should throw resource exists error if name exists', async () => {
        validateResource.mockReturnValue({ isValid: true });
        ResourceModel.exists.mockReturnValue(true);

        await expect(async () => {
          await resourcesDataSource.create(name, link);
        }).rejects.toThrow('Resource already exists.');
      });

      it('should throw resource slug exists error if slug already exists', async () => {
        validateResource.mockReturnValue({ isValid: true });
        ResourceModel.exists.mockReturnValueOnce(false);
        ResourceModel.exists.mockReturnValueOnce(true);

        await expect(async () => {
          await resourcesDataSource.create(name, link);
        }).rejects.toThrow('Resource slug already exists.');
      });

      it('should throw if request fails', async () => {
        validateResource.mockReturnValue({ isValid: true });
        ResourceModel.create.mockImplementation(() => {
          throw new Error();
        });

        await expect(async () => {
          await resourcesDataSource.create(name, link);
        }).rejects.toThrow();
      });

      it('should return created resource if successful', async () => {
        validateResource.mockReturnValue({ isValid: true });
        slugify.mockReturnValue(slug);
        const expected = { name, slug, link };
        ResourceModel.create.mockReturnValue(expected);

        const actual = await resourcesDataSource.create(name, link);

        expect(actual).toBe(expected);
      });

      it('should call create if successful', async () => {
        validateResource.mockReturnValue({ isValid: true });
        slugify.mockReturnValue(slug);
        const expected = { name, slug, link, createdBy: userId };

        await resourcesDataSource.create(name, link);

        expect(ResourceModel.create.mock.calls[0][0]).toEqual(expected);
      });
    });
  });
});
