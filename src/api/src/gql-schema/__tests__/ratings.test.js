const { resolvers } = require('../ratings');

describe('ratings resolvers', () => {
  let topicId;
  let resourceId;
  let ratingId;
  let userId;
  let value;
  let ratingsDataSource;
  let usersDataSource;
  let context;

  beforeEach(() => {
    topicId = 'topic123';
    resourceId = 'resource123';
    ratingId = 'rating123';
    userId = 'user123';
    value = 5;

    ratingsDataSource = {};
    usersDataSource = {};
    context = {
      dataSources: {
        ratings: ratingsDataSource,
        usersDataSource,
      },
    };
  });

  describe('userRating query', () => {
    it('should return user rating for topic resource', () => {
      const expected = { value };
      ratingsDataSource.getUserRatingForTopicResource = () => expected;

      const actual = resolvers.Query.userRating(
        null,
        { topicId, resourceId },
        context
      );

      expect(actual).toBe(expected);
    });

    it('should call getUserRatingForTopicResource for topic resource', () => {
      ratingsDataSource.getUserRatingForTopicResource = jest.fn();

      resolvers.Query.userRating(null, { topicId, resourceId }, context);

      expect(
        ratingsDataSource.getUserRatingForTopicResource.mock.calls[0][0]
      ).toBe(topicId);
      expect(
        ratingsDataSource.getUserRatingForTopicResource.mock.calls[0][1]
      ).toBe(resourceId);
    });
  });

  describe('createRating mutation', () => {
    it('should return created user rating for topic resource', () => {
      const expected = { value };
      ratingsDataSource.create = () => expected;

      const actual = resolvers.Mutation.createRating(
        null,
        { topicId, resourceId, value },
        context
      );

      expect(actual).toBe(expected);
    });

    it('should create user rating for topic resource', () => {
      ratingsDataSource.create = jest.fn();

      resolvers.Mutation.createRating(
        null,
        { topicId, resourceId, value },
        context
      );

      expect(ratingsDataSource.create.mock.calls[0][0]).toBe(topicId);
      expect(ratingsDataSource.create.mock.calls[0][1]).toBe(resourceId);
      expect(ratingsDataSource.create.mock.calls[0][2]).toBe(value);
    });
  });

  describe('updateRating mutation', () => {
    it('should return updated user rating for topic resource', () => {
      const expected = { value };
      ratingsDataSource.update = () => expected;

      const actual = resolvers.Mutation.updateRating(
        null,
        { ratingId, value },
        context
      );

      expect(actual).toBe(expected);
    });

    it('should create user rating for topic resource', () => {
      ratingsDataSource.update = jest.fn();

      resolvers.Mutation.updateRating(null, { ratingId, value }, context);

      expect(ratingsDataSource.update.mock.calls[0][0]).toBe(ratingId);
      expect(ratingsDataSource.update.mock.calls[0][1]).toBe(value);
    });
  });

  describe('rating createdBy resolver', () => {
    it('should return user for rating', () => {
      const expected = { userId };
      usersDataSource.getUser = () => expected;

      const actual = resolvers.Rating.createdBy(
        { createdBy: userId },
        null,
        context
      );

      expect(actual).toBe(expected);
    });

    it('should get user for user id', () => {
      usersDataSource.getUser = jest.fn();

      resolvers.Rating.createdBy({ createdBy: userId }, null, context);

      expect(usersDataSource.getUser.mock.calls[0][0]).toBe(userId);
    });
  });

  describe('rating list', () => {
    let ratings;
    let ratingsAverage;
    let ratingsCount;
    let ratingsSum;

    beforeEach(() => {
      ratings = [
        { value: 1 },
        { value: 1 },
        { value: 3 },
        { value: 5 },
        { value: 5 },
      ];
      ratingsAverage = 3;
      ratingsCount = 5;
      ratingsSum = 15;
    });

    describe('average resolver', () => {
      it('should return 0 if null ratings', () => {
        const average = resolvers.RatingList.average(null);

        expect(average).toBe(0);
      });

      it('should return 0 if no ratings', () => {
        const average = resolvers.RatingList.average([]);

        expect(average).toBe(0);
      });

      it('should return average rating value if has ratings', () => {
        const expected = ratingsAverage;

        const actual = resolvers.RatingList.average(ratings);

        expect(actual).toBe(expected);
      });
    });

    describe('count resolver', () => {
      it('should return 0 if ratings is null', () => {
        const count = resolvers.RatingList.count(null);

        expect(count).toBe(0);
      });

      it('should return ratings count if has ratings', () => {
        const expected = ratingsCount;

        const actual = resolvers.RatingList.count(ratings);

        expect(actual).toBe(expected);
      });
    });

    describe('sum resolver', () => {
      it('should reutrn 0 if ratings is null', () => {
        const sum = resolvers.RatingList.sum(null);

        expect(sum).toBe(0);
      });

      it('should return sum if has ratings', () => {
        const expected = ratingsSum;

        const actual = resolvers.RatingList.sum(ratings);

        expect(actual).toBe(expected);
      });
    });

    describe('ratings resolver', () => {
      it('should return ratings', () => {
        const expected = ratings;

        const actual = resolvers.RatingList.ratings(ratings);

        expect(actual).toBe(expected);
      });
    });
  });
});
