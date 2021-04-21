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
    id: ID!
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
    #  topic(id: ID!): Topic
    #  resources: [Resource]
  }

  # type Mutation {
  #  createTopic(name: String!): Topic
  #  createResource(topicId: ID!, name: String!, link: String): Resource
  #  createRating(topicId: ID!, resourceId: ID!, value: Int!): Rating
  # }
`;

module.exports = typeDefs;
