/**
 * Data source for tracking read only mode.
 */
class ReadOnlyModeDataSource {
  /**
   * Initialize with a feature flag querier.
   * @param {object} featureFlagEnabledQuerier The service to check feature flag enabled status.
   */
  constructor(featureFlagEnabledQuerier) {
    this.featureFlagEnabledQuerier = featureFlagEnabledQuerier;
  }

  /**
   * Check if read only mode is enabled.
   * @return {Promise<boolean>} True/false for if read only mode is enabled.
   */
  async isReadOnlyEnabled() {
    return this.featureFlagEnabledQuerier.isEnabled('read_only_mode');
  }
}

module.exports = ReadOnlyModeDataSource;
