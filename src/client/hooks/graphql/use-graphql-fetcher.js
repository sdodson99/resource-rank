import constate from 'constate';
import { createGraphQLFetcher } from '../../services/graphql-fetchers/graphql-fetcher-factory';

async function executeGraphQLFetch(document, variables) {
  const graphqlFetcher = createGraphQLFetcher();

  return await graphqlFetcher.fetch(document, variables);
}

export function useGraphQLFetcher() {
  return executeGraphQLFetch;
}

const [GraphQLFetcherProvider, useGraphQLFetcherContext] =
  constate(useGraphQLFetcher);

export { GraphQLFetcherProvider };
export default useGraphQLFetcherContext;
