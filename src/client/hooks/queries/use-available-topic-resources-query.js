import availableTopicResourcesQuery from '@/graphql/queries/available-topic-resources-query';
import useLazyGraphQLRequest from '../graphql/use-lazy-graphql-request';

export default function useAvailableTopicResourcesQuery() {
  return useLazyGraphQLRequest(availableTopicResourcesQuery);
}
