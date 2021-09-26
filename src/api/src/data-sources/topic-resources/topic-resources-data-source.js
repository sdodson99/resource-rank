const { ApolloError } = require('apollo-server-express');

/**
 * Data source for topic resources.
 */
class TopicResourcesDataSource {
  /**
   * Initialize with data sources.
   * @param {object} topicsDataSource Data source for topics.
   * @param {object} resourcesDataSource Data source resources.
   * @param {object} ratingsDataSource Data source for topic resource ratings.
   */
  constructor(topicsDataSource, resourcesDataSource, ratingsDataSource) {
    this.topicsDataSource = topicsDataSource;
    this.resourcesDataSource = resourcesDataSource;
    this.ratingsDataSource = ratingsDataSource;
  }

  /**
   * Get a topic resource by the topic and resource slug.
   * @param {string} topicSlug The topic slug.
   * @param {string} resourceSlug The resource slug.
   * @return {object} The topic resource for the slugs.
   */
  async getBySlug(topicSlug, resourceSlug) {
    const topic = await this.topicsDataSource.getBySlug(topicSlug);
    const resource = await this.resourcesDataSource.getBySlug(resourceSlug);

    if (!topic || !resource) {
      throw new ApolloError(
        'Topic resource not found.',
        'TOPIC_RESOURCE_NOT_FOUND'
      );
    }

    return {
      topic,
      resource,
    };
  }

  /**
   * Search for topic resources by topic ID.
   * @param {string} topicId The ID of the topic for the topic resources.
   * @param {object} searchOptions The options for the topic resource search.
   * @return {object} The topic resource search result.
   */
  async searchByTopicId(topicId, searchOptions) {
    const topic = await this.topicsDataSource.getById(topicId);

    return this.searchByTopic(topic, searchOptions);
  }

  /**
   * Search for topic resources by topic model.
   * @param {object} topic The the topic with the topic resources.
   * @param {object} searchOptions The options for the topic resource search.
   * @return {object} The topic resource search result.
   */
  async searchByTopic(topic, { search = '', offset = 0, limit = 20 } = {}) {
    // TODO: Clean up this spaghetti
    if (!topic || !topic.resources) {
      return {
        items: [],
        totalCount: 0,
      };
    }

    let resourceIds = [];
    if (topic && topic.resources) {
      resourceIds = topic.resources.map((r) => r.resource);
    }

    const filteredResources = await this.resourcesDataSource.getByIds(
      resourceIds,
      search
    );

    const topicResources = filteredResources.map((r) => ({
      resource: r,
      topic,
      createdBy: r.createdBy,
    }));

    const topicResourceRatings = await this.ratingsDataSource.getAllForManyTopicResources(
      topicResources
    );

    const ratedTopicResources = [];

    for (let index = 0; index < topicResources.length; index++) {
      const currentTopicResource = topicResources[index];
      const currentTopicResourceRatings = topicResourceRatings[index];

      const ratingSum = currentTopicResourceRatings
        .map((r) => r.value)
        .reduce((prev, curr) => prev + curr, 0);
      const ratingCount = currentTopicResourceRatings.length;
      const averageRating = ratingCount === 0 ? 0 : ratingSum / ratingCount;

      ratedTopicResources.push({
        ...currentTopicResource,
        averageRating,
      });
    }

    ratedTopicResources.sort(
      (tr1, tr2) =>
        tr2.resource.verified - tr1.resource.verified ||
        tr2.averageRating - tr1.averageRating
    );

    const paginatedTopicResources = ratedTopicResources.slice(
      offset,
      offset + limit
    );

    return {
      items: paginatedTopicResources,
      totalCount: filteredResources.length,
    };
  }
}

module.exports = TopicResourcesDataSource;
