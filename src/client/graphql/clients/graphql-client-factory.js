import GraphQLClient from './graphql-client';
import configuration from '@/configuration/index';

export const createGraphQLClient = () => {
  return new GraphQLClient(configuration.GRAPHQL_URL);
};
