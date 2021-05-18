const { DataSource } = require('apollo-datasource');
const { Topic } = require('../../mongoose/models/topic');
const { ApolloError, AuthenticationError } = require('apollo-server');

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
   */
  getById(id) {
    return this.topicModel.findOne({ _id: id });
  }

  /**
   * Search for topics.
   * @param {string} query The topic query to search for.
   * @return {Promise<object>} The topics matching the query.
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
   */
  nameExists(name) {
    return this.topicModel.exists({ name });
  }

  /**
   * Create a new topic.
   * @param {string} name The name of the topic.
   * @return {Promise<object>} The created topic.
   * @throws {ApolloError} Thrown if topic name alredy exists.
   * @throws {AuthenticationError} Thrown if user is not authenticated.
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
}

module.exports = MongoTopicsDataSource;
