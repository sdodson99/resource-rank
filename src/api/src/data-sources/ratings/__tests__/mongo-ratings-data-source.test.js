const MongoRatingsDataSource = require('../mongo-ratings-data-source');
const {
  RatingModel,
} = require('../../../features/ratings/mongoose/rating-model');
const { AuthenticationError } = require('apollo-server');

jest.mock('../../../features/ratings/mongoose/rating-model');

describe('MongoRatingsDataSource', () => {
  let mongoRatingsDataSource;

  let topicId;
  let resourceId;
  let ratingId;
  let validRating;
  let invalidRating;

  beforeEach(() => {
    RatingModel.mockClear();
    RatingModel.find.mockClear();
    RatingModel.findOne.mockClear();
    RatingModel.create.mockClear();
    RatingModel.updateOne.mockClear();

    mongoRatingsDataSource = new MongoRatingsDataSource();

    topicId = 'topic123';
    resourceId = 'resource123';
    ratingId = 'rating123';
    validRating = 3;
    invalidRating = 50;
  });

  describe('initialize', () => {
    it('should set user from config', () => {
      const expected = { name: 'some-user' };
      const config = { context: { user: expected } };

      mongoRatingsDataSource.initialize(config);

      const actual = mongoRatingsDataSource.user;
      expect(actual).toBe(expected);
    });
  });

  describe('getAllForTopicResource', () => {
    it('should return ratings for topic resource when topic resource has ratings', async () => {
      const expected = [
        {
          topic: topicId,
          resource: resourceId,
          rating: 5,
        },
        {
          topic: topicId,
          resource: resourceId,
          rating: 3,
        },
      ];
      const other = [
        {
          topic: 'other123',
          resource: 'other123',
          rating: 1,
        },
      ];
      RatingModel.find.mockReturnValue([...expected, ...other]);

      const actual = await mongoRatingsDataSource.getAllForTopicResource(
        topicId,
        resourceId
      );

      expect(actual).toEqual(expected);
    });

    it('should return empty array when topic resource has no ratings', async () => {
      const other = [
        {
          topic: 'other123',
          resource: 'other123',
          rating: 1,
        },
      ];
      RatingModel.find.mockReturnValue(other);

      const actual = await mongoRatingsDataSource.getAllForTopicResource(
        topicId,
        resourceId
      );

      expect(actual).toHaveLength(0);
    });

    it('should throw error if query fails', async () => {
      RatingModel.find.mockImplementation(() => {
        throw new Error();
      });

      await expect(async () => {
        await mongoRatingsDataSource.getAllForTopicResource(
          topicId,
          resourceId
        );
      }).rejects.toThrow();
    });
  });

  describe('getAllForManyTopicResources', () => {
    let topicResourceIds;

    beforeEach(() => {
      topicResourceIds = [
        {
          topicId: 't1',
          resourceId: 'r1',
        },
        {
          topicId: 't2',
          resourceId: 'r2',
        },
      ];
    });

    it('should return parallel array for topic resource ratings', async () => {
      const expected = [
        [
          {
            topic: 't1',
            resource: 'r1',
            rating: 5,
          },
          {
            topic: 't1',
            resource: 'r1',
            rating: 3,
          },
        ],
        [
          {
            topic: 't2',
            resource: 'r2',
            rating: 5,
          },
        ],
      ];
      RatingModel.find.mockReturnValue([
        {
          topic: 't1',
          resource: 'r1',
          rating: 5,
        },
        {
          topic: 't1',
          resource: 'r1',
          rating: 3,
        },
        {
          topic: 't2',
          resource: 'r2',
          rating: 5,
        },
      ]);

      const actual = await mongoRatingsDataSource.getAllForManyTopicResources(
        topicResourceIds
      );

      expect(actual).toEqual(expected);
    });

    it('should throw error if query fails', async () => {
      RatingModel.find.mockImplementation(() => {
        throw new Error();
      });

      await expect(async () => {
        await mongoRatingsDataSource.getAllForManyTopicResources(
          topicResourceIds
        );
      }).rejects.toThrow();
    });
  });

  describe('with unauthenticated user', () => {
    it('should throw authentication error on getUserRatingForTopicResource', async () => {
      await expect(async () => {
        await mongoRatingsDataSource.getUserRatingForTopicResource(
          topicId,
          resourceId
        );
      }).rejects.toThrow(AuthenticationError);
    });

    it('should throw authentication error on create', async () => {
      await expect(async () => {
        await mongoRatingsDataSource.create(topicId, resourceId, 123);
      }).rejects.toThrow(AuthenticationError);
    });

    it('should throw authentication error on update', async () => {
      await expect(async () => {
        await mongoRatingsDataSource.update('rating123', 123);
      }).rejects.toThrow(AuthenticationError);
    });
  });

  describe('with authenticated user', () => {
    let userId;

    beforeEach(() => {
      userId = '123';

      mongoRatingsDataSource.user = { id: userId };
    });

    describe('getUserRatingForTopicResource', () => {
      it('should return rating', async () => {
        const expected = { value: 5 };
        RatingModel.findOne.mockReturnValue(expected);

        const actual = await mongoRatingsDataSource.getUserRatingForTopicResource(
          topicId,
          resourceId
        );

        expect(actual).toBe(expected);
      });

      it('should call rating model with correct query', async () => {
        await mongoRatingsDataSource.getUserRatingForTopicResource(
          topicId,
          resourceId
        );

        expect(RatingModel.findOne.mock.calls[0][0]).toEqual({
          topic: topicId,
          resource: resourceId,
          createdBy: userId,
        });
      });

      it('should throw if query fails', async () => {
        RatingModel.findOne.mockImplementation(() => {
          throw new Error();
        });

        await expect(async () => {
          await mongoRatingsDataSource.getUserRatingForTopicResource(
            topicId,
            resourceId
          );
        }).rejects.toThrow();
      });
    });

    describe('create', () => {
      it('should throw invalid rating error if value is invalid', async () => {
        await expect(async () => {
          await mongoRatingsDataSource.create(
            topicId,
            resourceId,
            invalidRating
          );
        }).rejects.toThrow('Rating must be between 0 and 5.');
      });

      describe('with existing rating', () => {
        it('should throw rating already exists error', async () => {
          RatingModel.findOne.mockReturnValue({ value: 5 });

          await expect(async () => {
            await mongoRatingsDataSource.create(
              topicId,
              resourceId,
              validRating
            );
          }).rejects.toThrow(
            'A rating already exists for this topic resource.'
          );
        });
      });

      describe('with non-existing rating', () => {
        beforeEach(() => {
          RatingModel.findOne.mockReturnValue(null);
        });

        it('should return created rating', async () => {
          const expected = { value: validRating };
          RatingModel.create.mockReturnValue(expected);

          const actual = await mongoRatingsDataSource.create(
            topicId,
            resourceId,
            validRating
          );

          expect(actual).toBe(expected);
        });

        it('should call create with new rating', async () => {
          await mongoRatingsDataSource.create(topicId, resourceId, validRating);

          expect(RatingModel.create.mock.calls[0][0]).toEqual({
            value: validRating,
            topic: topicId,
            resource: resourceId,
            createdBy: userId,
          });
        });

        it('should throw error if create fails', async () => {
          RatingModel.create.mockImplementation(() => {
            throw new Error();
          });

          await expect(async () => {
            await mongoRatingsDataSource.create(
              topicId,
              resourceId,
              validRating
            );
          }).rejects.toThrow();
        });
      });
    });

    describe('update', () => {
      it('should throw invalid rating error if value is invalid', async () => {
        await expect(async () => {
          await mongoRatingsDataSource.update(ratingId, invalidRating);
        }).rejects.toThrow('Rating must be between 0 and 5.');
      });

      it('should return true if updated record count equal to 1', async () => {
        RatingModel.updateOne.mockReturnValue({ ok: 1 });

        const result = await mongoRatingsDataSource.update(
          ratingId,
          validRating
        );

        expect(result).toBeTruthy();
      });

      it('should return false if updated record count equal to 0', async () => {
        RatingModel.updateOne.mockReturnValue({ ok: 0 });

        const result = await mongoRatingsDataSource.update(
          ratingId,
          validRating
        );

        expect(result).toBeFalsy();
      });

      it('should call update for user rating', async () => {
        RatingModel.updateOne.mockReturnValue({ ok: 1 });

        await mongoRatingsDataSource.update(ratingId, validRating);

        expect(RatingModel.updateOne.mock.calls[0][0]).toEqual({
          _id: ratingId,
          createdBy: userId,
        });
      });

      it('should call update with value', async () => {
        RatingModel.updateOne.mockReturnValue({ ok: 1 });

        await mongoRatingsDataSource.update(ratingId, validRating);

        expect(RatingModel.updateOne.mock.calls[0][1]).toEqual({
          value: validRating,
        });
      });

      it('should throw if update request fails', async () => {
        RatingModel.updateOne.mockImplementation(() => {
          throw new Error();
        });

        await expect(async () => {
          await mongoRatingsDataSource.update(ratingId, invalidRating);
        }).rejects.toThrow();
      });
    });
  });
});
