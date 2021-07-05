import { GraphQLClient } from 'graphql-request';
import firebase from 'firebase/app';

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

export default class GraphQLFetcher {
  constructor(url) {
    this.url = url;
  }

  /**
   * Make a GraphQL request.
   * @param {string} document The GraphQL request document.
   * @param {object} variables The variables for the request.
   * @return {object} The request data.
   */
  async fetch(document, variables) {
    const graphQLClient = createGraphQLClient(this.url);

    const currentUser = getCurrentUser();
    if (currentUser) {
      const accessToken = await currentUser.getIdToken();
      graphQLClient.setHeader('authorization', `Bearer ${accessToken}`);
    }

    return graphQLClient.request(document, variables);
  }
}
