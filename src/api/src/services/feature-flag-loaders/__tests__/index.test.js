const { when } = require('jest-when');
const FirebaseFeatureFlagLoader = require('..');

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
    it('should initialize fields', () => {
      const featureFlagLoader = new FirebaseFeatureFlagLoader(
        app,
        featureFlagsDatabasePath
      );

      expect(featureFlagLoader.app).toBe(app);
      expect(featureFlagLoader.featureFlagsDatabasePath).toBe(
        featureFlagsDatabasePath
      );
      expect(featureFlagLoader.featureFlags.length).toBe(0);
      expect(featureFlagLoader.loaded).toBeFalsy();
    });

    it('should subscribe to feature flag changes', () => {
      mockOn.mockImplementation((_, cb) => {
        cb({
          val: () => {
            return {
              test1: {
                is_enabled: true,
              },
            };
          },
        });
      });

      const featureFlagLoader = new FirebaseFeatureFlagLoader(
        app,
        featureFlagsDatabasePath
      );

      expect(featureFlagLoader.loaded).toBeTruthy();
      expect(featureFlagLoader.featureFlags).toEqual([
        {
          name: 'test1',
          isEnabled: true,
        },
      ]);
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
      mockGet.mockReturnValue({
        val: () => ({
          test123: {
            is_enabled: true,
          },
        }),
      });

      const featureFlags = await featureFlagLoader.load();

      expect(featureFlagLoader.loaded).toBeTruthy();
      expect(featureFlags).toEqual([{ name: 'test123', isEnabled: true }]);
    });

    it('should return empty feature flags if feature flag data is null', async () => {
      mockGet.mockReturnValue({
        val: () => null,
      });

      const featureFlags = await featureFlagLoader.load();

      expect(featureFlags).toEqual([]);
    });

    it('should return feature flags without loading if already loaded', async () => {
      featureFlagLoader.loaded = true;
      featureFlagLoader.featureFlags = [{ name: 'test' }];

      const featureFlags = await featureFlagLoader.load();

      expect(featureFlags).toEqual([{ name: 'test' }]);
    });
  });
});
