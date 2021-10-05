const { gql } = require('apollo-server');

exports.typeDefs = gql`
  type Query {
    topics(search: String, offset: Int, limit: Int): TopicListing
    topicExists(name: String!): Boolean
    topic(id: ID!): Topic
    topicBySlug(slug: String!): Topic
  }

  type Mutation {
    createTopic(name: String!): Topic
  }

  type TopicListing {
    items: [Topic]
    totalCount: Int
  }

  type Topic {
    id: ID!
    name: String!
    slug: String
    resources(searchOptions: SearchOptionsInput): TopicResourceListing
    createdBy: User
    verified: Boolean
  }

  type TopicResourceListing {
    items: [TopicResource]
    totalCount: Int!
  }

  type TopicResource {
    resource: Resource!
    ratingList: RatingList
    createdBy: User
  }
`;

exports.resolvers = {
  Query: {
    topics: (_, { search, offset, limit }, { dataSources }) =>
      dataSources.topics.search(search, {
        offset,
        limit,
      }),
    topic: (_, { id }, { dataSources }) => dataSources.topics.getById(id),
    topicBySlug: (_, { slug }, { dataSources }) =>
      dataSources.topics.getBySlug(slug),
    topicExists: (_, { name }, { dataSources }) =>
      dataSources.topics.nameExists(name),
  },
  Mutation: {
    createTopic: (_, { name }, { dataSources }) =>
      dataSources.topics.create(name),
  },
  Topic: {
    resources: (topic, { searchOptions }, { dataSources }) =>
      dataSources.topicResources.searchByTopic(topic, searchOptions),
    createdBy: ({ createdBy }, _, { dataSources }) =>
      dataSources.users.getById(createdBy),
  },
};
