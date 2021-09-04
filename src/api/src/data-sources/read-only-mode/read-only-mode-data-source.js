/**
 * Data source for tracking read only mode.
 */
class ReadOnlyModeDataSource {
  /**
   * Initialize with a feature flag loader.
   * @param {object} featureFlagLoader The feature flag loader service.
   */
  constructor(featureFlagLoader) {
    this.featureFlagLoader = featureFlagLoader;
  }

  /**
   * Check if read only mode is enabled.
   * @return {Promise<boolean>} True/false for if read only mode is enabled.
   */
  async isReadOnlyEnabled() {
    const featureFlags = await this.featureFlagLoader.load();
    
    return featureFlags.some((f) => f.name === 'read_only_mode' && f.isEnabled);
  }
}

module.exports = ReadOnlyModeDataSource;
