const { when } = require('jest-when');
const FeatureFlagsDataSource = require('../feature-flags-data-source');

describe('FeatureFlagsDataSource', () => {
  let featureFlagGetAllQuery;
  let featureFlagEnabledQuery;

  let featureFlagsDataSource;

  beforeEach(() => {
    featureFlagGetAllQuery = {
      execute: jest.fn(),
    };
    featureFlagEnabledQuery = {
      execute: jest.fn(),
    };

    featureFlagsDataSource = new FeatureFlagsDataSource(
      featureFlagGetAllQuery,
      featureFlagEnabledQuery
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
      featureFlagGetAllQuery.execute.mockReturnValue({
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
      when(featureFlagEnabledQuery.execute)
        .calledWith(name)
        .mockReturnValue(expected);

      const actual = await featureFlagsDataSource.isEnabled(name);

      expect(actual).toBe(expected);
    });
  });
});
