/**
 * Service for checking if a feature flag is enabled.
 */
class FeatureFlagEnabledQuerier {
  /**
   * Initialize with a get all feature flags querier.
   * @param {object} featureFlagGetAllQuerier Service to load feature flags.
   */
  constructor(featureFlagGetAllQuerier) {
    this.featureFlagGetAllQuerier = featureFlagGetAllQuerier;
  }

  /**
   * Check if a feature flag is enabled.
   * @param {string} featureFlagName The name of the feature flag to check.
   * @return {Promise<boolean>} True/false for is toggled on.
   */
  async isEnabled(featureFlagName) {
    const featureFlagMap = await this.featureFlagGetAllQuerier.getAll();

    return featureFlagMap.isEnabled(featureFlagName);
  }
}

module.exports = FeatureFlagEnabledQuerier;
