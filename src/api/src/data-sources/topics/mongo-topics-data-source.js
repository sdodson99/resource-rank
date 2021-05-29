const { DataSource } = require('apollo-datasource');
const { Topic } = require('../../mongoose/models/topic');
const { ApolloError, AuthenticationError } = require('apollo-server');
const DataLoader = require('dataloader');

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
   * Search for topics.
   * @param {string} query The topic query to search for.
   * @return {Promise<object>} The topics matching the query.
   * @throws {Error} Thrown if query fails.
   */
  search(query) {
    return this.topicModel.find({
      name: { $regex: query, $options: 'i' },
    });
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
   * @throws {AuthenticationError} Thrown if user is not authenticated.
   * @throws {Error} Thrown if create fails.
   */
  async create(name) {
    if (!this.user) {
      throw new AuthenticationError();
    }
    const { uid } = this.user;

    if (await this.nameExists(name)) {
      throw new ApolloError('Topic already exists.', 'TOPIC_ALREADY_EXISTS');
    }

    return await this.topicModel.create({ name, createdBy: uid });
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
