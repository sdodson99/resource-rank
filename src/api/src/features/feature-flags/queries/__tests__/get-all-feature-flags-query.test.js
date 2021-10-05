const { when } = require('jest-when');
const { GetAllFeatureFlagsQuery } = require('../get-all-feature-flags-query');
const { FeatureFlagMap } = require('../../feature-flag-map');

describe('GetAllFeatureFlagsQuery', () => {
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

      const getAllFeatureFlagsQuery = new GetAllFeatureFlagsQuery(
        app,
        featureFlagsDatabasePath
      );

      expect(getAllFeatureFlagsQuery.loaded).toBeTruthy();
      expect(getAllFeatureFlagsQuery.featureFlagMap.data).toEqual(expected);
    });
  });

  describe('getAll', () => {
    let getAllFeatureFlagsQuery;

    beforeEach(() => {
      getAllFeatureFlagsQuery = new GetAllFeatureFlagsQuery(
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

      const featureFlagMap = await getAllFeatureFlagsQuery.execute();

      expect(getAllFeatureFlagsQuery.loaded).toBeTruthy();
      expect(featureFlagMap.data).toEqual(expected);
    });

    it('should return empty feature flags if feature flag data is null', async () => {
      mockGet.mockReturnValue({
        val: () => null,
      });

      const featureFlags = await getAllFeatureFlagsQuery.execute();

      expect(featureFlags.data).toEqual({});
    });

    it('should return feature flags without loading if already loaded', async () => {
      const expected = new FeatureFlagMap();
      getAllFeatureFlagsQuery.loaded = true;
      getAllFeatureFlagsQuery.featureFlagMap = expected;

      const featureFlagMap = await getAllFeatureFlagsQuery.execute();

      expect(featureFlagMap).toEqual(expected);
    });
  });
});
