const { User } = require('../user');

describe('User', () => {
  let id;
  let username;

  let user;

  beforeEach(() => {
    id = '123';
    username = 'username';

    user = new User(id, username);
  });

  it('should expose properties', () => {
    const { id: actualId, username: actualUsername } = user;

    expect(actualId).toBe(id);
    expect(actualUsername).toBe(username);
  });
});
