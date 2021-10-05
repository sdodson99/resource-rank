/**
 * Data source for loading feature flags.
 */
class FeatureFlagsDataSource {
  /**
   * Initialize a feature flags data source.
   * @param {object} featureFlagGetAllQuery The query to get all feature flags.
   * @param {object} featureFlagEnabledQuery The query to check if a feature flag is enabled.
   */
  constructor(featureFlagGetAllQuery, featureFlagEnabledQuery) {
    this.featureFlagGetAllQuery = featureFlagGetAllQuery;
    this.featureFlagEnabledQuery = featureFlagEnabledQuery;
  }

  /**
   * Get all feature flags.
   * @return {Promise<Array>} The loaded feature flags.
   */
  async getAll() {
    const featureFlagMap = await this.featureFlagGetAllQuery.execute();

    return featureFlagMap.toArray();
  }

  /**
   * Check if a feature flag is enabled.
   * @param {string} featureFlagName The name of the feature flag to check.
   * @return {Promise<boolean>} True/false for is toggled on.
   */
  async isEnabled(featureFlagName) {
    return await this.featureFlagEnabledQuery.execute(featureFlagName);
  }
}

module.exports = FeatureFlagsDataSource;
