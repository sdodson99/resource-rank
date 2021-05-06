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
    resource(id: ID!): Resource
    resourceExists(name: String!): Boolean
    availableResources(
      topicId: ID!
      offset: Int
      limit: Int
      search: String
    ): [AvailableResource]
  }

  type Mutation {
    createTopic(name: String!): Topic
    createResource(name: String!, link: String!): Resource
    createTopicResource(topicId: ID!, resourceId: ID!): Boolean
    createRating(topicId: ID!, resourceId: ID!, value: Int!): Rating
  }
`;

module.exports = typeDefs;
