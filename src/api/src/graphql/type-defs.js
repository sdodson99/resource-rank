const { gql } = require('apollo-server');

const typeDefs = gql`
  type Rating {
    id: ID!
    value: Int!
  }

  type Resource {
    id: ID!
    name: String!
    link: String
  }

  type TopicResource {
    resource: Resource!
    ratings: [Rating]
  }

  type Topic {
    id: ID!
    name: String!
    resources: [TopicResource]
  }

  type Query {
    topics: [Topic]
    resources: [Resource]
  }

  type Mutation {
    createTopic(name: String!): Topic
    createResource(name: String!, link: String): Resource
  }
`;

module.exports = typeDefs;
