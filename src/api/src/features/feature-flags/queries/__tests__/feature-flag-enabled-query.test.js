const { when } = require('jest-when');
const { FeatureFlagEnabledQuery } = require('../feature-flag-enabled-query');

describe('FeatureFlagEnabledQuery', () => {
  let featureFlagEnabledQuery;
  let featureFlagMap;

  beforeEach(() => {
    featureFlagMap = {
      isEnabled: jest.fn(),
    };
    const featureFlagGetAllQuery = {
      execute: () => featureFlagMap,
    };

    featureFlagEnabledQuery = new FeatureFlagEnabledQuery(
      featureFlagGetAllQuery
    );
  });

  it('should return result of feature flag enabled check', async () => {
    const name = 'test';
    const expected = true;
    when(featureFlagMap.isEnabled).calledWith(name).mockReturnValue(true);

    const actual = await featureFlagEnabledQuery.execute(name);

    expect(actual).toBe(expected);
  });
});
