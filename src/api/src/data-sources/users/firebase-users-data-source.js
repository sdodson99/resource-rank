const DataLoader = require('dataloader');
const logger = require('../../monitoring/logger');

const FIREBASE_USERS_MAX_BATCH_SIZE = 100;

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

    this.userByIdDataLoader = new DataLoader(
      async (userIds) => {
        const userIdentifiers = userIds.map((uid) => ({ uid }));
        const { users } = await this.firebaseApp
          .auth()
          .getUsers(userIdentifiers);

        const usersMap = {};
        users.forEach((user) => {
          usersMap[user.uid] = user;
        });

        return userIds.map((uid) => usersMap[uid]);
      },
      {
        maxBatchSize: FIREBASE_USERS_MAX_BATCH_SIZE,
      }
    );
  }

  /**
   * Get a user by ID.
   * @param {string} id The user ID to query for.
   * @return {object} The user represented by the ID. Empty if user does not exist.
   */
  async getUser(id) {
    try {
      const user = await this.userByIdDataLoader.load(id);

      if (!user) {
        logger.info('Unable to find user with ID', id);
        return {};
      }

      return user;
    } catch (error) {
      logger.error('Failed to load user with ID', id, error);
      return {};
    }
  }
}

module.exports = FirebaseUsersDataSource;
