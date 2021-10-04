/**
 * Data source for tracking read only mode.
 */
class ReadOnlyModeDataSource {
  /**
   * Initialize with a feature flag query.
   * @param {object} featureFlagEnabledQuery The service to check feature flag enabled status.
   */
  constructor(featureFlagEnabledQuery) {
    this.featureFlagEnabledQuery = featureFlagEnabledQuery;
  }

  /**
   * Check if read only mode is enabled.
   * @return {Promise<boolean>} True/false for if read only mode is enabled.
   */
  async isReadOnlyEnabled() {
    return this.featureFlagEnabledQuery.execute('read_only_mode');
  }
}

module.exports = ReadOnlyModeDataSource;
