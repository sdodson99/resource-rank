const { gql } = require('apollo-server');

exports.typeDefs = gql`
  input SearchOptionsInput {
    search: String
    offset: Int
    limit: Int
  }
`;
