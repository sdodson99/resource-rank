const { gql } = require('apollo-server');

exports.typeDefs = gql`
  type Query {
    topics(search: String): [Topic]
    topicExists(name: String!): Boolean
    topic(id: ID!): Topic
  }

  type Mutation {
    createTopic(name: String!): Topic
  }

  type Topic {
    id: ID!
    name: String!
    resources: [TopicResource]
    createdBy: User
  }
`;

exports.resolvers = {
  Query: {
    topics: (_, { search = '' }, { dataSources }) =>
      dataSources.topics.search(search),
    topic: (_, { id }, { dataSources }) => dataSources.topics.getById(id),
    topicExists: (_, { name }, { dataSources }) =>
      dataSources.topics.nameExists(name),
  },
  Mutation: {
    createTopic: (_, { name }, { dataSources }) =>
      dataSources.topics.create(name),
  },
  Topic: {
    resources: ({ id, resources }) => {
      if (!resources) {
        return [];
      }

      const topicResources = resources
        .filter((r) => r.resource)
        .map((r) => ({
          topicId: id,
          resourceId: r.resource,
          createdBy: r.createdBy,
        }));

      return topicResources;
    },
    createdBy: ({ createdBy }, _, { dataSources }) =>
      dataSources.usersDataSource.getUser(createdBy),
  },
};
