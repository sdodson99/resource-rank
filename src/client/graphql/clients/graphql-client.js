import { GraphQLClient as GraphQLClientBase } from 'graphql-request';
import firebase from 'firebase/app';

function createGraphQLClientBase(url) {
  return new GraphQLClientBase(url);
}

function getCurrentUser() {
  try {
    return firebase.auth().currentUser;
  } catch (error) {
    return null;
  }
}

export default class GraphQLClient {
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
    const graphQLClientBase = createGraphQLClientBase(this.url);

    const currentUser = getCurrentUser();
    if (currentUser) {
      const accessToken = await currentUser.getIdToken();
      graphQLClientBase.setHeader('authorization', `Bearer ${accessToken}`);
    }

    return graphQLClientBase.request(document, variables);
  }
}
