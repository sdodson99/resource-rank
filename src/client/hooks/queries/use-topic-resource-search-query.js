import topicsResourcesQuery from '@/graphql/queries/topic-resources-query';
import useLazyGraphQLRequest from '../graphql/use-lazy-graphql-request';

export default function useTopicResourceSearchQuery(topicId) {
  const { execute, ...others } = useLazyGraphQLRequest(
    topicsResourcesQuery
  );

  const executeSearch = (resourceSearch) =>
    execute({ topicId, resourceSearch });

  return {
    execute: executeSearch,
    ...others,
  };
}
