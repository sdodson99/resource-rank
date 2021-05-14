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

  type RatingList {
    average: Float
    count: Int
    sum: Int
    ratings: [Rating]
  }

  type TopicResource {
    topic: Topic!
    resource: Resource!
    ratingList: RatingList
  }

  type TopicResourceList {
    topicResources: [TopicResource]
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
    topics(search: String): [Topic]
    topicExists(name: String!): Boolean
    topic(id: ID!): Topic
    topicResourceList(topicId: ID!, resourceSearch: String): TopicResourceList
    topicResource(topicId: ID!, resourceId: ID!): TopicResource
    resources: [Resource]
    resource(id: ID!): Resource
    resourceExists(name: String!): Boolean
    userRating(topicId: ID!, resourceId: ID!): Rating
    availableResources(
      topicId: ID!
      offset: Int
      limit: Int
      search: String
    ): [AvailableResource]
    readOnlyModeEnabled: Boolean
  }

  type Mutation {
    createTopic(name: String!): Topic
    createResource(name: String!, link: String!): Resource
    createTopicResource(topicId: ID!, resourceId: ID!): Boolean
    createRating(topicId: ID!, resourceId: ID!, value: Int!): Rating
    updateRating(ratingId: ID!, value: Int!): Boolean
  }
`;

module.exports = typeDefs;
