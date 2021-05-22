const { gql } = require('apollo-server');

exports.typeDefs = gql`
  type Resource {
    id: ID!
    name: String!
    link: String
    createdBy: User
  }

  type Query {
    resources(search: String): [Resource]
    resource(id: ID!): Resource
    resourceExists(name: String!): Boolean
  }

  type Mutation {
    createTopic(name: String!): Topic
  }
`;
