import { GraphQLClient } from 'graphql-request';
import constate from 'constate';
import firebase from 'firebase';

function createGraphQLClient(url) {
  return new GraphQLClient(url);
}

function getCurrentUser() {
  try {
    return firebase.auth().currentUser;
  } catch (error) {
    return null;
  }
}

function useGraphQLFetcher({ url }) {
  return async (document, variables) => {
    const graphQLClient = createGraphQLClient(url);

    const currentUser = getCurrentUser();
    if (currentUser) {
      const accessToken = await currentUser.getIdToken();
      graphQLClient.setHeader('authorization', `Bearer ${accessToken}`);
    }

    return graphQLClient.request(document, variables);
  };
}

const [GraphQLFetcherProvider, useGraphQLFetcherContext] =
  constate(useGraphQLFetcher);

export { GraphQLFetcherProvider };
export default useGraphQLFetcherContext;
