import topicsQuery from '@/graphql/queries/topics-query';
import useLazyGraphQLRequest from '../graphql/use-lazy-graphql-request';

export default function useTopicSearchQuery() {
  return useLazyGraphQLRequest(topicsQuery);
}
