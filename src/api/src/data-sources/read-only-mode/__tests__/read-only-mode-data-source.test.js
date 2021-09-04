const ReadOnlyModeDataSource = require('../read-only-mode-data-source');

describe('ReadOnlyModeDataSource', () => {
  let readOnlyModeDataSource;

  let featureFlagLoader;

  beforeEach(() => {
    featureFlagLoader = {
      load: jest.fn(),
    };

    readOnlyModeDataSource = new ReadOnlyModeDataSource(featureFlagLoader);
  });

  describe('isReadOnlyEnabled', () => {
    it('should return true is feature flags have read only mode enabled', async () => {
      featureFlagLoader.load.mockReturnValue([
        {
          name: 'read_only_mode',
          isEnabled: true,
        },
      ]);

      const enabled = await readOnlyModeDataSource.isReadOnlyEnabled();

      expect(enabled).toBeTruthy();
    });

    it('should return false is feature flags do not have read only mode feature flag', async () => {
      featureFlagLoader.load.mockReturnValue([
        {
          name: 'other_feature_flag',
          isEnabled: true,
        },
      ]);

      const enabled = await readOnlyModeDataSource.isReadOnlyEnabled();

      expect(enabled).toBeFalsy();
    });
  });
});
