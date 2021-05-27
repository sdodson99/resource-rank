const { gql } = require('apollo-server');

exports.typeDefs = gql`
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
`;

exports.resolvers = {
  Query: {
    topicResourceList: async (
      _,
      { topicId, resourceSearch = '' },
      { dataSources }
    ) => {
      const { resources } = await dataSources.topics.getById(topicId);

      return {
        topicResources: resources.map((r) => ({
          topicId: topicId,
          resourceId: r.resource,
          resourceSearch,
          createdBy: r.createdBy,
        })),
        topicId,
        resourceSearch,
      };
    },
    topicResource: (_, { topicId, resourceId }) => ({
      topicId,
      resourceId,
    }),
    availableResources: async (
      _,
      { topicId, search = '', offset = 0, limit = 20 },
      { dataSources }
    ) => {
      const resourceDTOs = await dataSources.resources.search(
        search,
        offset,
        limit
      );

      const availableResources = resourceDTOs.map((r) => ({
        id: r._id,
        name: r.name,
        link: r.link,
        alreadyAdded: false,
        createdBy: r.createdBy,
      }));

      const resourceMap = {};
      availableResources.forEach((r) => {
        resourceMap[r.id] = r;
      });

      const topic = await dataSources.topics.getById(topicId);
      topic.resources.forEach((resource) => {
        const { resource: resourceId } = resource;

        if (resourceMap[resourceId]) {
          resourceMap[resourceId].alreadyAdded = true;
        }
      });

      return availableResources;
    },
  },
  Mutation: {
    createTopicResource: (_, { topicId, resourceId }, { dataSources }) =>
      dataSources.topics.addResource(topicId, resourceId),
  },
  AvailableResource: {
    createdBy: ({ createdBy }, _, { dataSources }) =>
      dataSources.usersDataSource.getUser(createdBy),
  },
  TopicResource: {
    topic: ({ topicId }, _, { dataSources }) =>
      dataSources.topics.getById(topicId),
    resource: ({ topicId, resourceId }, _, { dataSources }) =>
      dataSources.resources.getById(resourceId),
    ratingList: ({ topicId, resourceId }, _, { dataSources }) =>
      dataSources.ratings.getAllForTopicResource(topicId, resourceId),
    createdBy: ({ createdBy }, _, { dataSources }) =>
      dataSources.usersDataSource.getUser(createdBy),
  },
  TopicResourceList: {
    topicResources: async (
      { topicResources, topicId, resourceSearch },
      _,
      { dataSources }
    ) => {
      const resourceIds = topicResources.map((tr) => tr.resourceId);
      const filteredResources = await dataSources.resources.getByIds(
        resourceIds,
        resourceSearch
      );

      return filteredResources.map((r) => ({
        resource: r,
        topicId,
        resourceId: r._id,
        createdBy: r.createdBy,
      }));
    },
  },
};
