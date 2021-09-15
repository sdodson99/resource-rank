import GraphQLClient from './graphql-client';
import configuration from '@/configuration/index';
import MockGraphQLClient from './mock-graphql-client';

export const createGraphQLClient = ({ mock } = {}) => {
  if (mock && configuration.ENVIRONMENT !== 'production') {
    return new MockGraphQLClient(mock);
  }

  return new GraphQLClient(configuration.GRAPHQL_URL);
};
