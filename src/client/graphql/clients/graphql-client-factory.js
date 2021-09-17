import GraphQLClient from './graphql-client';
import configuration from '@/configuration/index';
import MockGraphQLClient from './mock-graphql-client';

export const createGraphQLClient = ({ mock } = {}) => {
  const mockingEnabled = configuration.ENVIRONMENT !== 'production';

  if (mock && mockingEnabled) {
    return new MockGraphQLClient(mock);
  }

  return new GraphQLClient(configuration.GRAPHQL_URL);
};
