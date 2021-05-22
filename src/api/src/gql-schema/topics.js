const { gql } = require('apollo-server');

exports.typeDefs = gql`
  type Topic {
    id: ID!
    name: String!
    resources: [TopicResource]
    createdBy: User
  }

  type Query {
    topics(search: String): [Topic]
    topicExists(name: String!): Boolean
    topic(id: ID!): Topic
  }

  type Mutation {
    createResource(name: String!, link: String!): Resource
  }
`;
