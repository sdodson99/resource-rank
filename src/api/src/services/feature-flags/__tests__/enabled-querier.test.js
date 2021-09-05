const { when } = require('jest-when');
const FeatureFlagEnabledQuerier = require('../enabled-querier');

describe('FeatureFlagEnabledQuerier', () => {
  let featureFlagEnabledQuerier;
  let featureFlagMap;

  beforeEach(() => {
    featureFlagMap = {
      isEnabled: jest.fn(),
    };
    const featureFlagGetAllQuerier = {
      getAll: () => featureFlagMap,
    };

    featureFlagEnabledQuerier = new FeatureFlagEnabledQuerier(
      featureFlagGetAllQuerier
    );
  });

  it('should return result of feature flag enabled check', async () => {
    const name = 'test';
    const expected = true;
    when(featureFlagMap.isEnabled).calledWith(name).mockReturnValue(true);

    const actual = await featureFlagEnabledQuerier.isEnabled(name);

    expect(actual).toBe(expected);
  });
});
