/**
 * Service for checking if a feature flag is enabled.
 */
class FeatureFlagEnabledQuery {
  /**
   * Initialize with a get all feature flags querier.
   * @param {object} featureFlagGetAllQuery Service to get all feature flags.
   */
  constructor(featureFlagGetAllQuery) {
    this.featureFlagGetAllQuery = featureFlagGetAllQuery;
  }

  /**
   * Check if a feature flag is enabled.
   * @param {string} featureFlagName The name of the feature flag to check.
   * @return {Promise<boolean>} True/false for is toggled on.
   */
  async execute(featureFlagName) {
    const featureFlagMap = await this.featureFlagGetAllQuery.execute();

    return featureFlagMap.isEnabled(featureFlagName);
  }
}

exports.FeatureFlagEnabledQuery = FeatureFlagEnabledQuery;
