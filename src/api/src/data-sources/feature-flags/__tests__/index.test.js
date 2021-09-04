const FeatureFlagsDataSource = require('..');

describe('FeatureFlagsDataSource', () => {
  let featureFlagLoader;

  let featureFlagsDataSource;

  beforeEach(() => {
    featureFlagLoader = {
      load: jest.fn(),
    };

    featureFlagsDataSource = new FeatureFlagsDataSource(featureFlagLoader);
  });

  describe('getAll', () => {
    it('should return loaded feature flags', async () => {
      const expected = [
        {
          name: '123',
          isEnabled: true,
        },
      ];
      featureFlagLoader.load.mockReturnValue(expected);

      const actual = await featureFlagsDataSource.getAll();

      expect(actual).toBe(expected);
    });
  });
});
