const { FeatureFlag } = require('./feature-flag');

/**
 * Model for a feature flag map.
 */
class FeatureFlagMap {
  /**
   * Initialize a feature flag map model.
   * @param {object} data The raw feature flag data.
   */
  constructor(data) {
    this.data = data || {};
  }

  /**
   * Check if a feature flag is enabled.
   * @param {string} featureFlagName The name of the feature flag.
   * @return {boolean} True/false for if the feature flag is enabled.
   */
  isEnabled(featureFlagName) {
    const featureFlag = this.data[featureFlagName];

    if (!featureFlag) {
      return false;
    }

    return featureFlag.isEnabled;
  }

  /**
   * Convert the feature flag map to an array.
   * @return {Array} The array of feature flags.
   */
  toArray() {
    return Object.entries(this.data).map(
      ([key, value]) => new FeatureFlag(key, value.isEnabled)
    );
  }
}

exports.FeatureFlagMap = FeatureFlagMap;
