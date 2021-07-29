import getTopicResourceListingQuery from '@/graphql/queries/topic-resource-listing-query';
import useLazyGraphQLRequest from './graphql/use-lazy-graphql-request';

export default function useTopicResourceSearchQuery(topicId) {
  const { execute, ...others } = useLazyGraphQLRequest(
    getTopicResourceListingQuery
  );

  const executeSearch = async (resourceSearch) => {
    execute({ topicId, resourceSearch });
  };

  return {
    execute: executeSearch,
    ...others,
  };
}
