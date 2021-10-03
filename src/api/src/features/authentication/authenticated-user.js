/**
 * Authenticated user model.
 */
class AuthenticatedUser {
  /**
   * Initialize with authenticated user properties.
   * @param {string} id The user's ID.
   */
  constructor(id) {
    this.id = id;
  }
}

exports.AuthenticatedUser = AuthenticatedUser;
