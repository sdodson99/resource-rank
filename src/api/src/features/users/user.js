/**
 * User model.
 */
class User {
  /**
   * Initialize with user properties.
   * @param {string} id The user's ID.
   * @param {string} username The user's name.
   */
  constructor(id, username) {
    this.id = id;
    this.username = username;
  }
}

exports.User = User;
