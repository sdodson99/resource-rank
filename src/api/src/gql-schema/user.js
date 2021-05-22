const { gql } = require('apollo-server');

exports.typeDefs = gql`
  type User {
    id: String
    username: String
  }
`;
