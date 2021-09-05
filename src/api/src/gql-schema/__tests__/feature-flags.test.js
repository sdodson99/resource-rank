const { resolvers } = require('../feature-flags');

describe('feature flag resolvers', () => {
  describe('featureFlags query', () => {
    it('should return feature flags from data source', () => {
      const expected = [
        {
          name: 'test',
          isEnabled: true,
        },
      ];
      const context = {
        dataSources: {
          featureFlags: {
            getAll: () => expected,
          },
        },
      };

      const actual = resolvers.Query.featureFlags(null, null, context);

      expect(actual).toBe(expected);
    });
  });
});
