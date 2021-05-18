const firebaseAdmin = require('firebase-admin');

/**
 * Firebase Realtime representation of read only mode.
 */
class FirebaseReadOnlyModeDataSource {
  /**
   * Initialize with a Firebase app.
   * @param {firebaseAdmin.app.App} app The Firebase app to read values from.
   * @param {string} readOnlyModeDatabasePath The database path to the read only mode value.
   * @param {boolean} readOnlyEnabled The read only enabled fallback value.
   */
  constructor(app, readOnlyModeDatabasePath, readOnlyEnabled = false) {
    this.app = app;
    this.readOnlyModeDatabasePath = readOnlyModeDatabasePath;
    this.readOnlyEnabled = readOnlyEnabled;

    this.loaded = false;

    firebaseAdmin
      .database(app)
      .ref(this.readOnlyModeDatabasePath)
      .on('value', (data) => {
        const readOnlyEnabled = data.val();

        this.readOnlyEnabled = readOnlyEnabled;
        this.loaded = true;
      });
  }

  /**
   * Check if read only mode is enabled.
   * @return {Promise<boolean>} True/false for if read only mode is enabled.
   */
  async isReadOnlyEnabled() {
    if (!this.loaded) {
      const data = await firebaseAdmin
        .database(app)
        .ref(this.readOnlyModeDatabasePath)
        .get();

      this.readOnlyEnabled = data.val();
      this.loaded = true;
    }

    return this.readOnlyEnabled;
  }
}

module.exports = FirebaseReadOnlyModeDataSource;
