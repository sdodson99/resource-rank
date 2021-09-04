const { when } = require('jest-when');
const ReadOnlyModeDataSource = require('../read-only-mode-data-source');

describe('ReadOnlyModeDataSource', () => {
  let readOnlyModeDataSource;

  let featureFlagMap;

  beforeEach(() => {
    featureFlagMap = {
      isEnabled: jest.fn(),
    };
    const featureFlagLoader = {
      load: () => featureFlagMap,
    };

    readOnlyModeDataSource = new ReadOnlyModeDataSource(featureFlagLoader);
  });

  describe('isReadOnlyEnabled', () => {
    it('should return true if feature flags have read only mode enabled', async () => {
      when(featureFlagMap.isEnabled)
        .calledWith('read_only_mode')
        .mockReturnValue(true);

      const enabled = await readOnlyModeDataSource.isReadOnlyEnabled();

      expect(enabled).toBeTruthy();
    });

    it('should return false if feature flags do not have read only mode enabled', async () => {
      when(featureFlagMap.isEnabled)
        .calledWith('read_only_mode')
        .mockReturnValue(false);

      const enabled = await readOnlyModeDataSource.isReadOnlyEnabled();

      expect(enabled).toBeFalsy();
    });
  });
});
