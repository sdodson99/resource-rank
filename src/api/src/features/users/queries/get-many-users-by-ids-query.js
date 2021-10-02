const logger = require('../../../monitoring/logger');
const { User } = require('../user');

const MAX_FIREBASE_USERS_BATCH_SIZE = 100;

/**
 * Query for getting many Firebase users for many IDs.
 */
class GetManyUsersByIdsQuery {
  /**
   * Initialize with a Firebase app.
   * @param {object} firebaseApp The app for Firebase users.
   */
  constructor(firebaseApp) {
    this.firebaseApp = firebaseApp;
    this.maxBatchSize = MAX_FIREBASE_USERS_BATCH_SIZE;
  }

  /**
   * Execute the query for users.
   * @param {Array<string>} userIds The many user IDs. Must not be greater than 100 IDs.
   * @return {Promise<Array>} The parallel array of users for each user ID.
   * @throws If amount of user IDs is greater than 100.
   */
  async execute(userIds) {
    if (userIds.length > this.maxBatchSize) {
      logger.error(
        'Failed to batch load users. Amount of user IDs exceeded maximum 100.'
      );
      throw new Error('Amount of user IDs cannot exceed 100.');
    }

    const firebaseUserIdentifiers = userIds.map((uid) => ({ uid }));

    const { users } = await this.firebaseApp
      .auth()
      .getUsers(firebaseUserIdentifiers);

    const usersMap = {};
    users.forEach((user) => {
      usersMap[user.uid] = new User(user.uid, user.displayName);
    });

    return userIds.map((uid) => usersMap[uid]);
  }
}

exports.GetManyUsersByIdsQuery = GetManyUsersByIdsQuery;
