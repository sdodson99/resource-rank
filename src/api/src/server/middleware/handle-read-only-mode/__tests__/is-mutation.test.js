const isMutation = require('../is-mutation');

describe('isMutation', () => {
  it('should return false if no request', () => {
    const result = isMutation(null);

    expect(result).toBeFalsy();
  });

  it('should return false if no request body', () => {
    const result = isMutation({});

    expect(result).toBeFalsy();
  });

  it('should return false if no request body query', () => {
    const result = isMutation({
      body: {},
    });

    expect(result).toBeFalsy();
  });

  it('should return false if request body query is not a mutation', () => {
    const result = isMutation({
      body: {
        query: 'query document',
      },
    });

    expect(result).toBeFalsy();
  });

  it('should return true if request body query is a mutation', () => {
    const result = isMutation({
      body: {
        query: 'mutation document',
      },
    });

    expect(result).toBeTruthy();
  });
});
