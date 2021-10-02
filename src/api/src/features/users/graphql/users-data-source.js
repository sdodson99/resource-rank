const logger = require('../../../monitoring/logger');
const { createUserByIdDataLoader } = require('./user-by-id-data-loader');

/**
 * Data source for users.
 */
class UsersDataSource {
  /**
   * Initialize with a Firebase app instance.
   * @param {object} firebaseApp The Firebase app to read user data from.
   */
  constructor(firebaseApp) {
    this.userByIdDataLoader = createUserByIdDataLoader(firebaseApp);
  }

  /**
   * Get a user by ID.
   * @param {string} id The user ID to query for.
   * @return {object} The user represented by the ID. Empty if user does not exist.
   */
  async getById(id) {
    try {
      const user = await this.userByIdDataLoader.load(id);

      if (!user) {
        logger.info('Unable to find user with ID', id);
        return null;
      }

      return user;
    } catch (error) {
      logger.error('Failed to load user with ID', id, error);
      return null;
    }
  }
}
exports.UsersDataSource = UsersDataSource;
