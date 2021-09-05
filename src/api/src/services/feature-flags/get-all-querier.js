const FeatureFlagMap = require('../../models/feature-flags/feature-flag-map');

/**
 * Service for getting all feature flags with Firebase.
 */
class FirebaseGetAllFeatureFlagsQuerier {
  /**
   * Initialize with a Firebase app.
   * @param {firebaseAdmin.app.App} app The Firebase app to read values from.
   * @param {string} featureFlagsDatabasePath The database path to the feature flag values.
   */
  constructor(app, featureFlagsDatabasePath) {
    this.featureFlagMap = new FeatureFlagMap();
    this.loaded = false;
    this.featureFlagDatabaseRef = app.database().ref(featureFlagsDatabasePath);

    this.featureFlagDatabaseRef.on('value', (data) => {
      const featureFlagData = data.val();

      this.featureFlagMap = this.toFeatureFlagMap(featureFlagData);
      this.loaded = true;
    });
  }

  /**
   * Get all feature flags.
   * @return {Promise<object>} The loaded feature flags.
   */
  async getAll() {
    if (!this.loaded) {
      const data = await this.featureFlagDatabaseRef.get();
      const featureFlagData = data.val();

      this.featureFlagMap = this.toFeatureFlagMap(featureFlagData);
      this.loaded = true;
    }

    return this.featureFlagMap;
  }

  /**
   * Map feature flag data to feature flags.
   * @param {object} featureFlagData The raw feature flag data.
   * @return {object} The feature flags map.
   */
  toFeatureFlagMap(featureFlagData) {
    return new FeatureFlagMap(featureFlagData);
  }
}

module.exports = FirebaseGetAllFeatureFlagsQuerier;
