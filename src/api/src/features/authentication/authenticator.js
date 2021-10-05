const logger = require('../../monitoring/logger');
const { AuthenticatedUser } = require('./authenticated-user');

const BEARER_PREFIX = 'Bearer ';

/**
 * Verify user tokens.
 */
class Authenticator {
  /**
   * Initialize with a Firebase app.
   * @param {object} firebaseApp The initialized Firebase app.
   */
  constructor(firebaseApp) {
    this.firebaseApp = firebaseApp;
  }

  /**
   * Authenticate the user from an HTTP request.
   * @param {object} request The incoming HTTP request.
   * @return {object|null} The user represented by the request, or null if authentication fails.
   */
  async authenticate(request) {
    const bearerToken = request.headers.authorization;

    if (!bearerToken) {
      return null;
    }

    if (!bearerToken.startsWith(BEARER_PREFIX)) {
      return null;
    }

    const token = bearerToken.substring(BEARER_PREFIX.length);

    try {
      const { uid } = await this.firebaseApp.auth().verifyIdToken(token);

      return new AuthenticatedUser(uid);
    } catch (error) {
      logger.warn('Unable to verify Firebase user ID token.', error);
      return null;
    }
  }
}

exports.Authenticator = Authenticator;
