const { gql } = require('apollo-server');

exports.typeDefs = gql`
  type Query {
    featureFlags: [FeatureFlag]
  }

  type FeatureFlag {
    name: String!
    isEnabled: String
  }
`;

exports.resolvers = {
  Query: {
    featureFlags: (_, __, { dataSources }) =>
      dataSources.featureFlags.getAll(),
  },
};
