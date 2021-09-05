const { when } = require('jest-when');
const FeatureFlagsDataSource = require('..');

describe('FeatureFlagsDataSource', () => {
  let featureFlagGetAllQuerier;
  let featureFlagEnabledQuerier;

  let featureFlagsDataSource;

  beforeEach(() => {
    featureFlagGetAllQuerier = {
      getAll: jest.fn(),
    };
    featureFlagEnabledQuerier = {
      isEnabled: jest.fn(),
    };

    featureFlagsDataSource = new FeatureFlagsDataSource(
      featureFlagGetAllQuerier,
      featureFlagEnabledQuerier
    );
  });

  describe('getAll', () => {
    it('should return loaded feature flags', async () => {
      const expected = [
        {
          name: '123',
          isEnabled: true,
        },
      ];
      featureFlagGetAllQuerier.getAll.mockReturnValue({
        toArray: () => expected,
      });

      const actual = await featureFlagsDataSource.getAll();

      expect(actual).toBe(expected);
    });
  });

  describe('isEnabled', () => {
    it('should return value of if feature flag is enabled', async () => {
      const expected = true;
      const name = 'test';
      when(featureFlagEnabledQuerier.isEnabled)
        .calledWith(name)
        .mockReturnValue(expected);

      const actual = await featureFlagsDataSource.isEnabled(name);

      expect(actual).toBe(expected);
    });
  });
});
