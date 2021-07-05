import GraphQLFetcher from './graphql-fetcher';
import configuration from '../../configuration';

export const createGraphQLFetcher = () => {
  return new GraphQLFetcher(configuration.GRAPHQL_URL);
};
