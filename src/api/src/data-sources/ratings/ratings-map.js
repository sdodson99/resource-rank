/**
 * Data structure to handle mapping of topic resource ids to ratings.
 */
class RatingsMap {
  /**
   * Initialize map.
   */
  constructor() {
    this._map = {};
  }

  /**
   * Add a rating to the map.
   * @param {Object} rating The rating to add.
   */
  addRating(rating) {
    const key = this.createKey(rating.topic, rating.resource);

    if (!this._map[key]) {
      this._map[key] = [];
    }

    this._map[key].push(rating);
  }

  /**
   * Get the ratings for a topic resource.
   * @param {String} topicId The topic id.
   * @param {String} resourceId The resource id.
   * @return {Array} The ratings for the resource topic.
   */
  getRatings(topicId, resourceId) {
    const key = this.createKey(topicId, resourceId);

    return this._map[key] || [];
  }

  /**
   * Create a key for the rating map.
   * @param {String} topicId The rating topic id.
   * @param {String} resourceId The rating resource id.
   * @return {String} The key for the rating.
   */
  createKey(topicId, resourceId) {
    return `${topicId}:${resourceId}`;
  }
}

module.exports = RatingsMap;
