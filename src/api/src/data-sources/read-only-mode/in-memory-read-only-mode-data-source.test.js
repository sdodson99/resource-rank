const InMemoryReadOnlyModeDataSource = require('./in-memory-read-only-mode-data-source');

describe('InMemoryReadOnlyModeDataSource', () => {
  let inMemoryReadOnlyModeDataSource;

  let readOnlyEnabled;

  beforeEach(() => {
    readOnlyEnabled = true;

    inMemoryReadOnlyModeDataSource = new InMemoryReadOnlyModeDataSource(
      readOnlyEnabled
    );
  });

  describe('isReadOnlyEnabled', () => {
    it('should return read only enabled value', () => {
      const expected = readOnlyEnabled;

      const actual = inMemoryReadOnlyModeDataSource.isReadOnlyEnabled();

      expect(actual).toEqual(expected);
    });
  });
});
