const { gql } = require('apollo-server');

exports.typeDefs = gql`
  type TopicResource {
    topic: Topic!
    resource: Resource!
    ratingList: RatingList
    createdBy: User
  }

  type TopicResourceList {
    topicResources: [TopicResource]
  }

  type AvailableResource {
    id: ID!
    name: String!
    link: String
    alreadyAdded: Boolean
    createdBy: User
  }

  type Query {
    topicResourceList(topicId: ID!, resourceSearch: String): TopicResourceList
    topicResource(topicId: ID!, resourceId: ID!): TopicResource
    availableResources(
      topicId: ID!
      offset: Int
      limit: Int
      search: String
    ): [AvailableResource]
  }

  type Mutation {
    createTopicResource(topicId: ID!, resourceId: ID!): Boolean
  }
`;
