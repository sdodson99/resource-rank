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
    resourceInfo: Resource!
    ratings: [Rating]
  }

  type Topic {
    id: ID!
    name: String!
    resources: [TopicResource]
  }

  type AvailableResource {
    id: ID!
    name: String!
    link: String
    alreadyAdded: Boolean
  }

  type Query {
    topics: [Topic]
    topicExists(name: String!): Boolean
    topic(id: ID!): Topic
    resources: [Resource]
    availableResources(
      topicId: ID!
      offset: Int
      limit: Int
    ): [AvailableResource]
  }

  type Mutation {
    createTopic(name: String!): Topic
    createResource(name: String!, link: String): Resource
    createTopicResource(topicId: ID!, resourceId: ID!): Boolean
    createRating(topicId: ID!, resourceId: ID!, value: Int!): Rating
  }
`;

module.exports = typeDefs;
