import useLazyGraphQLRequest from './graphql/use-lazy-graphql-request';
import getTopicResourceListingQuery from '../gql-requests/get-topic-resource-listing-query';

export default function useTopicResourceSearchQuery(topicId) {
  const { execute, data, ...others } = useLazyGraphQLRequest(
    getTopicResourceListingQuery
  );

  const executeSearch = async (resourceSearch) => {
    execute({ topicId, resourceSearch });
  };

  return {
    execute: executeSearch,
    data: data?.topicResourceList?.topicResources ?? [],
    ...others,
  };
}
