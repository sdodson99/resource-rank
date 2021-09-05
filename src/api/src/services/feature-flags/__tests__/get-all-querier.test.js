const { when } = require('jest-when');
const FirebaseGetAllFeatureFlagsQuerier = require('../get-all-querier');
const FeatureFlagMap = require('../../../models/feature-flags/feature-flag-map');

describe('FirebaseGetAllFeatureFlagsQuerier', () => {
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

      const getAllFeatureFlagsQuerier = new FirebaseGetAllFeatureFlagsQuerier(
        app,
        featureFlagsDatabasePath
      );

      expect(getAllFeatureFlagsQuerier.loaded).toBeTruthy();
      expect(getAllFeatureFlagsQuerier.featureFlagMap.data).toEqual(expected);
    });
  });

  describe('getAll', () => {
    let getAllFeatureFlagsQuerier;

    beforeEach(() => {
      getAllFeatureFlagsQuerier = new FirebaseGetAllFeatureFlagsQuerier(
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

      const featureFlagMap = await getAllFeatureFlagsQuerier.getAll();

      expect(getAllFeatureFlagsQuerier.loaded).toBeTruthy();
      expect(featureFlagMap.data).toEqual(expected);
    });

    it('should return empty feature flags if feature flag data is null', async () => {
      mockGet.mockReturnValue({
        val: () => null,
      });

      const featureFlags = await getAllFeatureFlagsQuerier.getAll();

      expect(featureFlags.data).toEqual({});
    });

    it('should return feature flags without loading if already loaded', async () => {
      const expected = new FeatureFlagMap();
      getAllFeatureFlagsQuerier.loaded = true;
      getAllFeatureFlagsQuerier.featureFlagMap = expected;

      const featureFlagMap = await getAllFeatureFlagsQuerier.getAll();

      expect(featureFlagMap).toEqual(expected);
    });
  });
});
