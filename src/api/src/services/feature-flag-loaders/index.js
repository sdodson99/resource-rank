const FeatureFlag = require('../../models/feature-flag');

/**
 * Service for loading feature flags with Firebase.
 */
class FirebaseFeatureFlagLoader {
  /**
   * Initialize with a Firebase app.
   * @param {firebaseAdmin.app.App} app The Firebase app to read values from.
   * @param {string} featureFlagsDatabasePath The database path to the feature flag values.
   */
  constructor(app, featureFlagsDatabasePath) {
    this.app = app;
    this.featureFlagsDatabasePath = featureFlagsDatabasePath;
    this.featureFlags = [];
    this.loaded = false;

    this.app
      .database()
      .ref(this.featureFlagsDatabasePath)
      .on('value', (data) => {
        const featureFlagsData = data.val();

        this.featureFlags = this.toFeatureFlags(featureFlagsData);
        this.loaded = true;
      });
  }

  /**
   * Load feature flags.
   * @return {Promise<Array>} The loaded feature flags.
   */
  async load() {
    if (!this.loaded) {
      const data = await this.app
        .database()
        .ref(this.featureFlagsDatabasePath)
        .get();
      const featureFlagsData = data.val();

      this.featureFlags = this.toFeatureFlags(featureFlagsData);
      this.loaded = true;
    }

    return this.featureFlags;
  }

  /**
   * Map feature flag data to feature flags.
   * @param {Array} featureFlagsData The raw feature flag data.
   * @return {Array} The mapped feature flags.
   */
  toFeatureFlags(featureFlagsData) {
    if (!featureFlagsData) {
      return [];
    }

    return featureFlagsData.map((f) => new FeatureFlag(f.name, f.is_enabled));
  }
}

module.exports = FirebaseFeatureFlagLoader;
