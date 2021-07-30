import topicResourceListingQuery from '@/graphql/queries/topic-resource-listing-query';
import useLazyGraphQLRequest from '../graphql/use-lazy-graphql-request';

export default function useTopicResourceSearchQuery(topicId) {
  const { execute, ...others } = useLazyGraphQLRequest(
    topicResourceListingQuery
  );

  const executeSearch = (resourceSearch) =>
    execute({ topicId, resourceSearch });

  return {
    execute: executeSearch,
    ...others,
  };
}
