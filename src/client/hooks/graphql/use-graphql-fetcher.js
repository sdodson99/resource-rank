import { GraphQLClient } from 'graphql-request';
import constate from 'constate';

function createGraphQLClient(url) {
  return new GraphQLClient(url);
}

async function getAccessToken() {
  return 'token';
}

function useGraphQLFetcher({ url }) {
  return async (document, variables) => {
    const graphQLClient = createGraphQLClient(url);

    const accessToken = await getAccessToken();
    graphQLClient.setHeader('authorization', `Bearer ${accessToken}`);

    return graphQLClient.request(document, variables);
  };
}

const [GraphQLFetcherProvider, useGraphQLFetcherContext] =
  constate(useGraphQLFetcher);

export { GraphQLFetcherProvider };
export default useGraphQLFetcherContext;
