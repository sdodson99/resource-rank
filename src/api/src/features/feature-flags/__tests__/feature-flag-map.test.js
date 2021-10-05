const { FeatureFlagMap } = require('../feature-flag-map');

describe('FeatureFlagMap', () => {
  let featureFlagMap;

  beforeEach(() => {
    featureFlagMap = new FeatureFlagMap({
      test123: {
        isEnabled: true,
      },
      test456: {
        isEnabled: false,
      },
    });
  });

  describe('initialization', () => {
    it('should set featureFlagData to empty object if data is null', () => {
      const featureFlagMap = new FeatureFlagMap(null);

      expect(featureFlagMap.data).toEqual({});
    });
  });

  describe('isEnabled', () => {
    it('should return true if feature flag is enabled', () => {
      const result = featureFlagMap.isEnabled('test123');

      expect(result).toBeTruthy();
    });

    it('should return false if feature flag is not enabled', () => {
      const result = featureFlagMap.isEnabled('test456');

      expect(result).toBeFalsy();
    });

    it('should return false if feature flag not found', () => {
      const result = featureFlagMap.isEnabled('test789');

      expect(result).toBeFalsy();
    });
  });

  describe('toArray', () => {
    it('should return array of feature flags', () => {
      const expected = [
        {
          name: 'test123',
          isEnabled: true,
        },
        {
          name: 'test456',
          isEnabled: false,
        },
      ];

      const actual = featureFlagMap.toArray();

      expect(actual).toEqual(expected);
    });
  });
});
