const BEARER_PREFIX = 'Bearer ';

/**
 * Verify tokens via Firebase.
 */
class FirebaseUserDecoder {
  /**
   * Initialize with a Firebase app.
   * @param {firebase.app.App} firebaseApp The initialized Firebase app.
   */
  constructor(firebaseApp) {
    this.firebaseApp = firebaseApp;
  }

  /**
   * Get the user from an HTTP request.
   * @param {object} request The incoming HTTP request.
   * @return {object|null} The user represented by the request, or null if authentication fails.
   */
  async getUserFromRequest(request) {
    const bearerToken = request.headers.authorization;

    if (!bearerToken) {
      return null;
    }

    if (!bearerToken.startsWith(BEARER_PREFIX)) {
      return null;
    }

    const token = bearerToken.substring(BEARER_PREFIX.length);

    try {
      return await this.firebaseApp.auth().verifyIdToken(token);
    } catch (error) {
      return null;
    }
  }
}

module.exports = FirebaseUserDecoder;
