const { when } = require('jest-when');
const ReadOnlyModeDataSource = require('../read-only-mode-data-source');

describe('ReadOnlyModeDataSource', () => {
  let readOnlyModeDataSource;

  let featureFlagEnabledQuerier;

  beforeEach(() => {
    featureFlagEnabledQuerier = {
      isEnabled: jest.fn(),
    };

    readOnlyModeDataSource = new ReadOnlyModeDataSource(
      featureFlagEnabledQuerier
    );
  });

  describe('isReadOnlyEnabled', () => {
    it('should return read only mode feature flag enabled status', async () => {
      when(featureFlagEnabledQuerier.isEnabled)
        .calledWith('read_only_mode')
        .mockReturnValue(true);

      const enabled = await readOnlyModeDataSource.isReadOnlyEnabled();

      expect(enabled).toBeTruthy();
    });
  });
});
