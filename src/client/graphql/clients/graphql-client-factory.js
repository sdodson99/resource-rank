import GraphQLClient from './graphql-client';
import configuration from '../../configuration';

export const createGraphQLClient = () => {
  return new GraphQLClient(configuration.GRAPHQL_URL);
};
