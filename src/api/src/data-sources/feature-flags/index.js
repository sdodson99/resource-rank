/**
 * Data source for loading feature flags.
 */
class FeatureFlagsDataSource {
  /**
   * Initialize a feature flags data source.
   * @param {object} featureFlagLoader The service to load feature flags from.
   */
  constructor(featureFlagLoader) {
    this.featureFlagLoader = featureFlagLoader;
  }

  /**
   * Get all feature flags.
   * @return {Promise<Array>} The loaded feature flags.
   */
  async getAll() {
    return await this.featureFlagLoader.load();
  }
}

module.exports = FeatureFlagsDataSource;
