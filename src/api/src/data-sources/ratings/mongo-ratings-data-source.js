const { DataSource } = require('apollo-datasource');
const { Rating } = require('../../mongoose/models/rating');
const { ApolloError, AuthenticationError } = require('apollo-server');

/**
 * Data source for ratings from a Mongo database.
 */
class MongoRatingsDataSource extends DataSource {
  /**
   * Initialize with a Rating model.
   */
  constructor() {
    super();

    this.ratingModel = Rating;
    this.user = null;
  }

  /**
   * Initialize the data source with the request config.
   * @param {object} config The request config.
   */
  initialize({ context }) {
    const { user } = context;

    this.user = user;
  }

  /**
   * Get a user's rating for a topic resource.
   * @param {string} topicId The ID of the topic with the rating.
   * @param {string} resourceId The ID of the resource with the rating.
   * @return {Promise<object>} The user's rating for the topic resources.
   * @throws {AuthenticationError} Thrown if user not authenticated.
   */
  async getUserRatingForTopicResource(topicId, resourceId) {
    if (!this.user) {
      throw new AuthenticationError();
    }

    const { uid } = this.user;

    return this.ratingModel.findOne({
      topic: topicId,
      resource: resourceId,
      createdBy: uid,
    });
  }

  /**
   * Create a new rating for a topic resource.
   * @param {string} topicId The topic ID for the new rating.
   * @param {string} resourceId The resource ID for the new rating.
   * @param {number} value The value of the rating.
   * @return {Promise<object>} The created rating.
   * @throws {AuthenticationError} Thrown if user not authenticated.
   * @throws {ApolloError} Thrown if rating value is invalid.
   */
  async create(topicId, resourceId, value) {
    if (!this.user) {
      throw new AuthenticationError();
    }

    if (value < 0 || value > 5) {
      throw new ApolloError(
        'Rating must be between 0 and 5.',
        'INVALID_RATING'
      );
    }

    const { uid } = this.user;

    const existingRating = await this.ratingModel.findOne({
      topic: topicId,
      resource: resourceId,
      createdBy: uid,
    });

    if (existingRating) {
      throw new ApolloError(
        'A rating already exists for this topic resource.',
        'RATING_ALREADY_EXISTS'
      );
    }

    return await this.ratingModel.create({
      value,
      topic: topicId,
      resource: resourceId,
      createdBy: uid,
    });
  }

  /**
   * Update an existing rating value.
   * @param {string} ratingId The ID of the rating to update.
   * @param {number} value The updated rating value.
   * @return {Promise<boolean>} True/false for successfully updated.
   * @throws {AuthenticationError} Thrown if user not authenticated.
   * @throws {ApolloError} Thrown if rating value is invalid.
   */
  async update(ratingId, value) {
    if (!this.user) {
      throw new AuthenticationError();
    }

    if (value < 0 || value > 5) {
      throw new ApolloError(
        'Rating must be between 0 and 5.',
        'INVALID_RATING'
      );
    }

    const { uid } = this.user;

    const { ok } = await Rating.updateOne(
      { _id: ratingId, createdBy: uid },
      { value }
    );

    return ok > 0;
  }
}

module.exports = MongoRatingsDataSource;
