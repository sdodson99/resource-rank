const { DataSource } = require('apollo-datasource');
const { Topic } = require('../../mongoose/models/topic');

/**
 * Data source for topics from a Mongo database.
 */
class MongoTopicsDataSource extends DataSource {
  /**
   * Initialize with Topic model.
   */
  constructor() {
    super();

    this.topicModel = Topic;
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
}

module.exports = MongoTopicsDataSource;
