const { resolvers } = require('./configuration');

describe('configuration resolvers', () => {
  describe('readOnlyModeEnabled query', () => {
    it('should return read only mode from data source', () => {
      const expected = true;
      const context = {
        dataSources: {
          readOnlyModeDataSource: {
            isReadOnlyEnabled: () => expected,
          },
        },
      };

      const actual = resolvers.Query.readOnlyModeEnabled(null, null, context);

      expect(actual).toBe(expected);
    });
  });
});
