const MongoTopicsDataSource = require('../mongo-topics-data-source');
const { AuthenticationError } = require('apollo-server');
const { Topic } = require('../../../mongoose/models/topic');
const slugify = require('../../../services/slugify');
const validateTopic = require('../../../validators/topic');
const { when } = require('jest-when');

jest.mock('../../../mongoose/models/topic');
jest.mock('../../../services/slugify');
jest.mock('../../../validators/topic');

describe('MongoTopicsDataSource', () => {
  let mongoTopicsDataSource;

  beforeEach(() => {
    mongoTopicsDataSource = new MongoTopicsDataSource();
  });

  afterEach(() => {
    Topic.mockReset();
    Topic.find.mockReset();
    Topic.findOne.mockReset();
    Topic.exists.mockReset();
    Topic.create.mockReset();
    Topic.updateOne.mockReset();
    Topic.paginate.mockReset();

    slugify.mockReset();
    validateTopic.mockReset();
  });

  describe('initialize', () => {
    it('should set user from config', () => {
      const expected = { name: 'some-user' };
      const config = { context: { user: expected } };

      mongoTopicsDataSource.initialize(config);

      const actual = mongoTopicsDataSource.user;
      expect(actual).toBe(expected);
    });
  });

  describe('getById', () => {
    let topicId;

    beforeEach(() => {
      topicId = '123123123';
    });

    it('should return topic if topic ID found', async () => {
      const expected = { _id: topicId, name: 'test' };
      Topic.find.mockReturnValue([expected]);

      const actual = await mongoTopicsDataSource.getById(topicId);

      expect(actual).toBe(expected);
    });

    it('should return null if topic ID not found', async () => {
      Topic.find.mockReturnValue([]);

      const actual = await mongoTopicsDataSource.getById(topicId);

      expect(actual).toBeNull();
    });

    it('should throw if topic query fails', async () => {
      Topic.find.mockImplementation(() => {
        throw new Error();
      });

      await expect(async () => {
        await mongoTopicsDataSource.getById(topicId);
      }).rejects.toThrow();
    });
  });

  describe('getBySlug', () => {
    let slug;

    beforeEach(() => {
      slug = 'topic-name';
    });

    it('should return topic if topic slug found', async () => {
      const expected = { name: 'Topic Name', slug };
      Topic.findOne.mockReturnValue(expected);

      const actual = await mongoTopicsDataSource.getBySlug(slug);

      expect(actual).toBe(expected);
    });

    it('should return null if topic slug not found', async () => {
      Topic.findOne.mockReturnValue(null);

      const actual = await mongoTopicsDataSource.getBySlug(slug);

      expect(actual).toBeNull();
    });

    it('should throw if topic query fails', async () => {
      Topic.findOne.mockImplementation(() => {
        throw new Error();
      });

      await expect(async () => {
        await mongoTopicsDataSource.getBySlug(slug);
      }).rejects.toThrow();
    });
  });

  describe('search', () => {
    let query;
    let offset;
    let limit;

    beforeEach(() => {
      query = 'some-query';
      offset = 10;
      limit = 5;
    });

    it('should return paginated topics if query succeeds', async () => {
      const expected = {
        items: [{ id: '123' }, { id: '456' }],
        totalCount: 1,
      };
      when(Topic.paginate)
        .calledWith(
          {
            name: { $regex: query, $options: 'i' },
          },
          {
            offset,
            limit,
          }
        )
        .mockReturnValue({
          docs: [{ id: '123' }, { id: '456' }],
          total: 1,
        });

      const actual = await mongoTopicsDataSource.search(query, {
        offset,
        limit,
      });

      expect(actual).toEqual(expected);
    });

    it('should return default paginated topics when no options provided', async () => {
      const expected = {
        items: [{ id: '123' }, { id: '456' }],
        totalCount: 1,
      };
      when(Topic.paginate)
        .calledWith(
          {
            name: { $regex: '', $options: 'i' },
          },
          {
            offset: 0,
            limit: 20,
          }
        )
        .mockReturnValue({
          docs: [{ id: '123' }, { id: '456' }],
          total: 1,
        });

      const actual = await mongoTopicsDataSource.search();

      expect(actual).toEqual(expected);
    });

    it('should throw if query fails', async () => {
      Topic.paginate.mockImplementation(() => {
        throw new Error();
      });

      await expect(async () => {
        await mongoTopicsDataSource.search(query);
      }).rejects.toThrow();
    });
  });

  describe('nameExists', () => {
    let name;

    beforeEach(() => {
      name = 'some-name';
    });

    it('should return result if name query succeeds', async () => {
      const expected = true;
      Topic.exists.mockReturnValue(expected);

      const actual = await mongoTopicsDataSource.nameExists(name);

      expect(actual).toBe(expected);
    });

    it('should call topic model exists with name', async () => {
      await mongoTopicsDataSource.nameExists(name);

      expect(Topic.exists.mock.calls[0][0]).toEqual({ name });
    });

    it('should throw if name query fails', async () => {
      Topic.exists.mockImplementation(() => {
        throw new Error();
      });

      await expect(async () => {
        await mongoTopicsDataSource.nameExists(name);
      }).rejects.toThrow();
    });
  });

  describe('create', () => {
    let name;
    let slug;

    beforeEach(() => {
      name = 'some name';
      slug = 'some-name';
    });

    describe('with unauthenticated user', () => {
      it('should throw authentication error', async () => {
        await expect(async () => {
          await mongoTopicsDataSource.create(name);
        }).rejects.toThrow(AuthenticationError);
      });
    });

    describe('with authenticated user', () => {
      let userId;

      beforeEach(() => {
        userId = '123123';

        mongoTopicsDataSource.user = { uid: userId };
      });

      it('should throw topic validation error if topic is invalid', async () => {
        const code = 'TOPIC_VALIDATION_ERROR';
        const message = 'error message';
        validateTopic.mockReturnValue({
          isValid: false,
          message,
        });

        try {
          await mongoTopicsDataSource.create(name);

          fail();
        } catch (error) {
          expect(error.message).toBe(message);
          expect(error.extensions.code).toBe(code);
        }
      });

      it('should throw topic exists error if name already exists', async () => {
        validateTopic.mockReturnValue({ isValid: true });
        Topic.exists.mockReturnValue(true);

        await expect(async () => {
          await mongoTopicsDataSource.create(name);
        }).rejects.toThrow('Topic already exists.');
      });

      it('should throw topic slug exists error if slug already exists', async () => {
        validateTopic.mockReturnValue({ isValid: true });
        Topic.exists.mockReturnValueOnce(false);
        Topic.exists.mockReturnValueOnce(true);

        await expect(async () => {
          await mongoTopicsDataSource.create(name);
        }).rejects.toThrow('Topic slug already exists.');
      });

      it('should throw error if topic creation fails', async () => {
        validateTopic.mockReturnValue({ isValid: true });
        Topic.create.mockImplementation(() => {
          throw new Error();
        });

        await expect(async () => {
          await mongoTopicsDataSource.create(name);
        }).rejects.toThrow();
      });

      it('should create topic if successful', async () => {
        validateTopic.mockReturnValue({ isValid: true });
        slugify.mockReturnValue(slug);

        await mongoTopicsDataSource.create(name);

        expect(Topic.create.mock.calls[0][0]).toEqual({
          name,
          slug,
          createdBy: userId,
        });
      });

      it('should return created topic if successful', async () => {
        validateTopic.mockReturnValue({ isValid: true });
        slugify.mockReturnValue(slug);
        const expected = { name, slug, createdBy: userId };
        Topic.create.mockReturnValue(expected);

        const actual = await mongoTopicsDataSource.create(name);

        expect(actual).toBe(expected);
      });
    });
  });

  describe('addResource', () => {
    let topicId;
    let resourceId;

    beforeEach(() => {
      topicId = '123123';
      resourceId = '456456';
    });

    describe('with unauthenticated user', () => {
      it('should throw authentication error', async () => {
        await expect(async () => {
          await mongoTopicsDataSource.addResource(topicId, resourceId);
        }).rejects.toThrow(AuthenticationError);
      });
    });

    describe('with authenticated user', () => {
      let userId;

      beforeEach(() => {
        userId = '123123';

        mongoTopicsDataSource.user = { uid: userId };
      });

      it('should throw error if query fails', async () => {
        Topic.find.mockImplementation(() => {
          throw new Error();
        });

        await expect(async () => {
          await mongoTopicsDataSource.addResource(topicId, resourceId);
        }).rejects.toThrow();
      });

      it('should throw topic not found error if topic not found', async () => {
        Topic.find.mockReturnValue([]);

        await expect(async () => {
          await mongoTopicsDataSource.addResource(topicId, resourceId);
        }).rejects.toThrow('Topic not found.');
      });

      it('should throw topic resource exists error if topic already has resource', async () => {
        Topic.find.mockReturnValue([
          {
            _id: topicId,
            resources: [{ resource: resourceId }],
          },
        ]);

        await expect(async () => {
          await mongoTopicsDataSource.addResource(topicId, resourceId);
        }).rejects.toThrow('Topic resource already exists.');
      });

      describe('and with topic resource not already existing', () => {
        beforeEach(() => {
          Topic.find.mockReturnValue([
            {
              _id: topicId,
              resources: [{ resource: 'other-resource-id' }],
            },
          ]);
        });

        it('should add topic resource if update successful', async () => {
          const expectedTopicResource = {
            resource: resourceId,
            createdBy: userId,
          };
          Topic.updateOne.mockReturnValue({ nModified: 1 });

          await mongoTopicsDataSource.addResource(topicId, resourceId);

          expect(Topic.updateOne.mock.calls[0][0]).toEqual({ _id: topicId });
          expect(Topic.updateOne.mock.calls[0][1]).toEqual({
            $addToSet: { resources: expectedTopicResource },
          });
        });

        it('should return truthy if update successful', async () => {
          Topic.updateOne.mockReturnValue({ nModified: 1 });

          const success = await mongoTopicsDataSource.addResource(
            topicId,
            resourceId
          );

          expect(success).toBeTruthy();
        });

        it('should return falsy if update unsuccessful', async () => {
          Topic.updateOne.mockReturnValue({ nModified: 0 });

          const success = await mongoTopicsDataSource.addResource(
            topicId,
            resourceId
          );

          expect(success).toBeFalsy();
        });
      });
    });
  });
});
