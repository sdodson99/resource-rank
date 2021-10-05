import featureFlagsQuery from '@/graphql/queries/feature-flags-query';
import useGraphQLQuery from '../graphql/use-graphql-query';

export default function useFeatureFlagsQuery() {
  return useGraphQLQuery(featureFlagsQuery);
}
