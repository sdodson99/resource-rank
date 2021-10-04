const { when } = require('jest-when');
const ReadOnlyModeDataSource = require('../read-only-mode-data-source');

describe('ReadOnlyModeDataSource', () => {
  let readOnlyModeDataSource;

  let featureFlagEnabledQuery;

  beforeEach(() => {
    featureFlagEnabledQuery = {
      execute: jest.fn(),
    };

    readOnlyModeDataSource = new ReadOnlyModeDataSource(
      featureFlagEnabledQuery
    );
  });

  describe('isReadOnlyEnabled', () => {
    it('should return read only mode feature flag enabled status', async () => {
      when(featureFlagEnabledQuery.execute)
        .calledWith('read_only_mode')
        .mockReturnValue(true);

      const enabled = await readOnlyModeDataSource.isReadOnlyEnabled();

      expect(enabled).toBeTruthy();
    });
  });
});
