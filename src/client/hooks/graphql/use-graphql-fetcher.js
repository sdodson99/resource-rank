import constate from 'constate';
import { createGraphQLClient } from '@/graphql/clients/graphql-client-factory';
import useMockContext from '../use-mock-context';

async function executeGraphQLFetch(document, variables, { mock }) {
  const graphqlFetcher = createGraphQLClient({ mock });
  const result = await graphqlFetcher.fetch(document, variables);

  return result;
}

export function useGraphQLFetcher() {
  const mock = useMockContext();

  return (document, variables) =>
    executeGraphQLFetch(document, variables, { mock });
}

const [GraphQLFetcherProvider, useGraphQLFetcherContext] =
  constate(useGraphQLFetcher);

export { GraphQLFetcherProvider };
export default useGraphQLFetcherContext;
