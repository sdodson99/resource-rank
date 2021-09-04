const { when } = require('jest-when');
const FirebaseFeatureFlagLoader = require('..');
const FeatureFlagMap = require('../../../models/feature-flags/feature-flag-map');

describe('FirebaseFeatureFlagLoader', () => {
  let featureFlagsDatabasePath;
  let app;
  let mockOn;
  let mockGet;

  beforeEach(() => {
    featureFlagsDatabasePath = '/feature_flags';

    mockOn = jest.fn();
    mockGet = jest.fn();

    const mockRef = jest.fn();
    when(mockRef).calledWith(featureFlagsDatabasePath).mockReturnValue({
      on: mockOn,
      get: mockGet,
    });

    app = {
      database: () => ({
        ref: mockRef,
      }),
    };
  });

  describe('initialization', () => {
    it('should subscribe to feature flag changes', () => {
      const expected = {
        test1: {
          isEnabled: true,
        },
      };
      mockOn.mockImplementation((_, cb) => {
        cb({
          val: () => {
            return expected;
          },
        });
      });

      const featureFlagLoader = new FirebaseFeatureFlagLoader(
        app,
        featureFlagsDatabasePath
      );

      expect(featureFlagLoader.loaded).toBeTruthy();
      expect(featureFlagLoader.featureFlagMap.data).toEqual(expected);
    });
  });

  describe('load', () => {
    let featureFlagLoader;

    beforeEach(() => {
      featureFlagLoader = new FirebaseFeatureFlagLoader(
        app,
        featureFlagsDatabasePath
      );
    });

    it('should load and return feature flags if not already loaded', async () => {
      const expected = {
        test123: {
          is_enabled: true,
        },
      };
      mockGet.mockReturnValue({
        val: () => expected,
      });

      const featureFlagMap = await featureFlagLoader.load();

      expect(featureFlagLoader.loaded).toBeTruthy();
      expect(featureFlagMap.data).toEqual(expected);
    });

    it('should return empty feature flags if feature flag data is null', async () => {
      mockGet.mockReturnValue({
        val: () => null,
      });

      const featureFlags = await featureFlagLoader.load();

      expect(featureFlags.data).toEqual({});
    });

    it('should return feature flags without loading if already loaded', async () => {
      const expected = new FeatureFlagMap();
      featureFlagLoader.loaded = true;
      featureFlagLoader.featureFlagMap = expected;

      const featureFlagMap = await featureFlagLoader.load();

      expect(featureFlagMap).toEqual(expected);
    });
  });
});
