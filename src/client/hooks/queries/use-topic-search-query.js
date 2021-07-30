import topicsQuery from '@/graphql/queries/topics-query';
import useLazyGraphQLRequest from '../graphql/use-lazy-graphql-request';

export default function useTopicSearchQuery() {
  const { execute, ...others } = useLazyGraphQLRequest(topicsQuery);

  const executeSearch = (search) => execute({ search });

  return {
    execute: executeSearch,
    ...others,
  };
}
