import getTopicsQuery from '../gql-requests/get-topics-query';
import useLazyGraphQLRequest from './graphql/use-lazy-graphql-request';

export default function useTopicSearchQuery() {
  const { execute, data, ...others } = useLazyGraphQLRequest(getTopicsQuery);

  const executeSearch = async (search) => {
    execute({ search });
  };

  return {
    execute: executeSearch,
    data: data?.topics ?? [],
    ...others,
  };
}
