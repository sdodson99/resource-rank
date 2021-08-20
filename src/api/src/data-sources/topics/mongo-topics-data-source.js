const { DataSource } = require('apollo-datasource');
const { Topic } = require('../../mongoose/models/topic');
const { ApolloError, AuthenticationError } = require('apollo-server');
const DataLoader = require('dataloader');
const slugify = require('../../services/slugify');
const validateTopic = require('../../validators/topic');

/**
 * Data source for topics from a Mongo database.
 */
class MongoTopicsDataSource extends DataSource {
  /**
   * Initialize with Topic model.
   */
  constructor() {
    super();

    this.user = null;
    this.topicModel = Topic;

    this.topicDataLoader = new DataLoader(async (topicIds) => {
      const topics = await this.topicModel.find({
        _id: { $in: topicIds },
      });

      const topicsMap = {};
      topics.forEach((r) => {
        topicsMap[r._id] = r;
      });

      return topicIds.map((id) => topicsMap[id]);
    });
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
   * Find a topic by ID.
   * @param {string} id The ID of the topic to find.
   * @return {Promise<object>} The topic matching the ID. Null if topic not found.
   * @throws {Error} Thrown if query fails.
   */
  async getById(id) {
    const topic = await this.topicDataLoader.load(id);

    if (!topic) {
      return null;
    }

    return topic;
  }

  /**
   * Find a topic by slug.
   * @param {string} slug The slug of the topic to find.
   * @return {Promise<object>} The topic matching the slug. Null if topic not found.
   * @throws {Error} Thrown if query fails.
   */
  async getBySlug(slug) {
    const topic = await this.topicModel.findOne({
      slug,
    });

    if (!topic) {
      return null;
    }

    return topic;
  }

  /**
   * Search for topics.
   * @param {string} query The topic query to search for.
   * @param {object} options Options for the seach.
   * @return {Promise<object>} The topics matching the query.
   * @throws {Error} Thrown if query fails.
   */
  async search(query = '', { offset = 0, limit = 20 } = {}) {
    const { docs, total } = await this.topicModel.paginate(
      {
        name: { $regex: query, $options: 'i' },
      },
      {
        offset,
        limit,
      }
    );

    return {
      items: docs,
      totalCount: total,
    };
  }

  /**
   * Check if a topic name already exists.
   * @param {string} name The name to check.
   * @return {Promise<boolean>} True/false for already exists.
   * @throws {Error} Thrown if query fails.
   */
  nameExists(name) {
    return this.topicModel.exists({ name });
  }

  /**
   * Create a new topic.
   * @param {string} name The name of the topic.
   * @return {Promise<object>} The created topic.
   * @throws {ApolloError} Thrown if topic name already exists.
   * @throws {ApolloError} Thrown if topic validation fails.
   * @throws {AuthenticationError} Thrown if user is not authenticated.
   * @throws {Error} Thrown if create fails.
   */
  async create(name) {
    if (!this.user) {
      throw new AuthenticationError();
    }

    const { uid } = this.user;
    const slug = slugify(name);
    const topic = {
      name,
      slug,
      createdBy: uid,
    };

    const { isValid, message } = validateTopic(topic);

    if (!isValid) {
      throw new ApolloError(message, 'TOPIC_VALIDATION_ERROR');
    }

    if (await this.nameExists(topic.name)) {
      throw new ApolloError('Topic already exists.', 'TOPIC_ALREADY_EXISTS');
    }

    const slugExists = await this.topicModel.exists({ slug: topic.slug });

    if (slugExists) {
      throw new ApolloError(
        'Topic slug already exists.',
        'TOPIC_ALREADY_EXISTS'
      );
    }

    return await this.topicModel.create(topic);
  }

  /**
   * Create a new topic resource.
   * @param {string} topicId The ID of the topic for the topic resource.
   * @param {string} resourceId The ID of the resource for the topic resource.
   * @return {Promise<boolean>} True/false for success.
   * @throws {ApolloError} Thrown if topic resource already exists.
   * @throws {AuthenticationError} Thrown if user is not authenticated.
   * @throws {Error} Thrown if add fails.
   */
  async addResource(topicId, resourceId) {
    if (!this.user) {
      throw new AuthenticationError();
    }

    const topic = await this.getById(topicId);

    if (!topic) {
      throw new ApolloError('Topic not found.', 'TOPIC_NOT_FOUND');
    }

    const existingTopicResource = topic.resources.find(
      (r) => r.resource == resourceId
    );

    if (existingTopicResource) {
      throw new ApolloError(
        'Topic resource already exists.',
        'TOPIC_RESOURCE_ALREADY_EXISTS'
      );
    }

    const { uid } = this.user;
    const topicResource = {
      resource: resourceId,
      createdBy: uid,
    };

    const { nModified } = await this.topicModel.updateOne(
      { _id: topicId },
      { $addToSet: { resources: topicResource } }
    );

    return nModified;
  }
}

module.exports = MongoTopicsDataSource;
