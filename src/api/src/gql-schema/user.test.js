const { resolvers } = require('./user');

describe('user resolvers', () => {
  describe('user id resolver', () => {
    it('should return user id', () => {
      const userId = 'user123';
      const expected = userId;

      const actual = resolvers.User.id({ uid: userId });

      expect(actual).toBe(expected);
    });
  });

  describe('user username resolver', () => {
    it('should return username', () => {
      const username = 'username';
      const expected = username;

      const actual = resolvers.User.username({ displayName: username });

      expect(actual).toBe(expected);
    });
  });
});
