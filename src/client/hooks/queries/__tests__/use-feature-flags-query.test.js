import featureFlagsQuery from '@/graphql/queries/feature-flags-query';
import useGraphQLQuery from '@/hooks/graphql/use-graphql-query';
import { when } from 'jest-when';
import useFeatureFlagsQuery from '../use-feature-flags-query';

jest.mock('@/hooks/graphql/use-graphql-query');

describe('useFeatureFlagsQuery', () => {
  it('should return feature flag query result', () => {
    const expected = {};
    when(useGraphQLQuery)
      .calledWith(featureFlagsQuery)
      .mockReturnValue(expected);

    const actual = useFeatureFlagsQuery();

    expect(actual).toBe(expected);
  });
});
