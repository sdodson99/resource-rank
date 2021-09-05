/**
 * Data source for loading feature flags.
 */
class FeatureFlagsDataSource {
  /**
   * Initialize a feature flags data source.
   * @param {object} featureFlagGetAllQuerier The service to get all feature flags.
   * @param {object} featureFlagEnabledQuerier The service to check if a feature flag is enabled.
   */
  constructor(featureFlagGetAllQuerier, featureFlagEnabledQuerier) {
    this.featureFlagGetAllQuerier = featureFlagGetAllQuerier;
    this.featureFlagEnabledQuerier = featureFlagEnabledQuerier;
  }

  /**
   * Get all feature flags.
   * @return {Promise<Array>} The loaded feature flags.
   */
  async getAll() {
    const featureFlagMap = await this.featureFlagGetAllQuerier.getAll();

    return featureFlagMap.toArray();
  }

  /**
   * Check if a feature flag is enabled.
   * @param {string} featureFlagName The name of the feature flag to check.
   * @return {Promise<boolean>} True/false for is toggled on.
   */
  async isEnabled(featureFlagName) {
    return await this.featureFlagEnabledQuerier.isEnabled(featureFlagName);
  }
}

module.exports = FeatureFlagsDataSource;
