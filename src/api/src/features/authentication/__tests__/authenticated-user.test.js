const { AuthenticatedUser } = require('../authenticated-user');

describe('AuthenticatedUser', () => {
  let id;

  let authenticatedUser;

  beforeEach(() => {
    id = '123';

    authenticatedUser = new AuthenticatedUser(id);
  });

  it('should expose properties', () => {
    const { id: actualId } = authenticatedUser;

    expect(actualId).toBe(id);
  });
});
