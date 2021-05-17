/**
 * Data source for Firebase user data.
 */
class FirebaseUsersDataSource {
  /**
   * Initialize with a Firebase app instance.
   * @param {firebaseAdmin.app.App} firebaseApp The Firebase app to read user data from.
   */
  constructor(firebaseApp) {
    this.firebaseApp = firebaseApp;
  }

  /**
   * Get a user by ID.
   * @param {string} id The user ID to query for.
   * @return {object} The user represented by the ID. Empty if user does not exist.
   */
  async getUser(id) {
    try {
      const user = await this.firebaseApp.auth().getUser(id);
      return user || {};
    } catch (error) {
      return {};
    }
  }
}

module.exports = FirebaseUsersDataSource;
