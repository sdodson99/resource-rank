import topicsResourcesQuery from '@/graphql/queries/topic-resources-query';
import useLazyGraphQLRequest from '../graphql/use-lazy-graphql-request';

export default function useTopicResourceSearchQuery() {
  return useLazyGraphQLRequest(topicsResourcesQuery);
}
