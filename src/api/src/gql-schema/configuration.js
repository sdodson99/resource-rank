const { gql } = require('apollo-server');

exports.typeDefs = gql`
  type Query {
    readOnlyModeEnabled: Boolean
  }
`;

exports.resolvers = {
  Query: {
    readOnlyModeEnabled: (_, __, { dataSources }) =>
      dataSources.readOnlyModeDataSource.isReadOnlyEnabled(),
  },
};
