import useGraphQLFetcherContext from './graphql/use-graphql-fetcher';
import getTopicsQuery from '../gql-requests/get-topics-query';

export default function useTopicSearchQuery() {
  const gqlFetch = useGraphQLFetcherContext();

  const executeTopicSearchQuery = (search) => {
    return gqlFetch(getTopicsQuery, {
      search,
    });
  };

  return executeTopicSearchQuery;
}
