const MongoTopicsDataSource = require('./mongo-topics-data-source');
const { AuthenticationError } = require('apollo-server');

const { Topic } = require('../../mongoose/models/topic');
jest.mock('../../mongoose/models/topic');

describe('MongoTopicsDataSource', () => {
  let mongoTopicsDataSource;

  beforeEach(() => {
    Topic.mockReset();
    Topic.find.mockReset();
    Topic.exists.mockReset();
    Topic.create.mockReset();
    Topic.updateOne.mockReset();

    mongoTopicsDataSource = new MongoTopicsDataSource();
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

  describe('search', () => {
    let query;

    beforeEach(() => {
      query = 'some-query';
    });

    it('should return topics if query succeeds', async () => {
      const expected = [{ name: 'topic' }];
      Topic.find.mockReturnValue(expected);

      const actual = await mongoTopicsDataSource.search(query);

      expect(actual).toBe(expected);
    });

    it('should call topic model with query', async () => {
      await mongoTopicsDataSource.search(query);

      expect(Topic.find.mock.calls[0][0]).toEqual({
        name: { $regex: query, $options: 'i' },
      });
    });

    it('should throw if query fails', async () => {
      Topic.find.mockImplementation(() => {
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

    beforeEach(() => {
      name = 'some-name';
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

      it('should throw topic exists error if name already exists', async () => {
        Topic.exists.mockReturnValue(true);

        await expect(async () => {
          await mongoTopicsDataSource.create(name);
        }).rejects.toThrow('Topic already exists.');
      });

      it('should throw error if topic creation fails', async () => {
        Topic.create.mockImplementation(() => {
          throw new Error();
        });

        await expect(async () => {
          await mongoTopicsDataSource.create(name);
        }).rejects.toThrow();
      });

      it('should create topic if successful', async () => {
        await mongoTopicsDataSource.create(name);

        expect(Topic.create.mock.calls[0][0]).toEqual({
          name,
          createdBy: userId,
        });
      });

      it('should return created topic if successful', async () => {
        const expected = { name, createdBy: userId };
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
