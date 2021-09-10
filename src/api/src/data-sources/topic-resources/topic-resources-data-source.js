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
   * Search for topic resources.
   * @param {string} topicId The ID of the topic for the topic resources.
   * @param {object} searchOptions The options for the topic resource search.
   * @return {object} The topic resource search result.
   */
  async searchByTopicId(topicId, { search = '', offset = 0, limit = 20 } = {}) {
    const topic = await this.topicsDataSource.getById(topicId);

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

    // TODO: Clean up this spaghetti
    const filteredResources = await this.resourcesDataSource.getByIds(
      resourceIds,
      search
    );

    const topicResources = filteredResources.map((r) => ({
      topicId,
      resourceId: r._id,
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
