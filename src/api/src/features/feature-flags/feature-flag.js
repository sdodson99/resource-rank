/**
 * Model for a feature flag.
 */
class FeatureFlag {
  /**
   * Initialize a feature flag model.
   * @param {string} name The unique name of the feature flag.
   * @param {boolean} isEnabled True/false for is the feature flag is enabled.
   */
  constructor(name, isEnabled = false) {
    this.name = name;
    this.isEnabled = isEnabled;
  }
}

exports.FeatureFlag = FeatureFlag;
