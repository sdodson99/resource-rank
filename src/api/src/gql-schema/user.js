const { gql } = require('apollo-server');

exports.typeDefs = gql`
  type User {
    id: String
    username: String
  }
`;

exports.resolvers = {
  User: {
    id: ({ uid }) => uid,
    username: ({ displayName }) => displayName,
  },
};
