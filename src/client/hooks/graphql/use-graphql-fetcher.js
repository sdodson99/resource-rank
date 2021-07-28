import constate from 'constate';
import { createGraphQLClient } from '@/graphql/clients/graphql-client-factory';

async function executeGraphQLFetch(document, variables) {
  const graphqlFetcher = createGraphQLClient();

  return await graphqlFetcher.fetch(document, variables);
}

export function useGraphQLFetcher() {
  return executeGraphQLFetch;
}

const [GraphQLFetcherProvider, useGraphQLFetcherContext] =
  constate(useGraphQLFetcher);

export { GraphQLFetcherProvider };
export default useGraphQLFetcherContext;
