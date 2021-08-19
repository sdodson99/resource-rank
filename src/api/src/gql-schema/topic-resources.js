const { gql, ApolloError } = require('apollo-server');

exports.typeDefs = gql`
  type Query {
    topicResourceList(topicId: ID!, resourceSearch: String): TopicResourceList
    topicResource(topicId: ID!, resourceId: ID!): TopicResource
    topicResourceBySlug(
      topicSlug: String!
      resourceSlug: String!
    ): TopicResource
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
    resource: Resource!
    alreadyAdded: Boolean
  }
`;

exports.resolvers = {
  Query: {
    topicResourceList: async (
      _,
      { topicId, resourceSearch = '' },
      { dataSources }
    ) => {
      const topic = await dataSources.topics.getById(topicId);

      let resourceIds = [];
      if (topic && topic.resources) {
        resourceIds = topic.resources.map((r) => r.resource);
      }

      return {
        resourceIds,
        topicId,
        resourceSearch,
      };
    },
    topicResource: (_, { topicId, resourceId }) => ({
      topicId,
      resourceId,
    }),
    topicResourceBySlug: async (
      _,
      { topicSlug, resourceSlug },
      { dataSources: { topics, resources } }
    ) => {
      const topic = await topics.getBySlug(topicSlug);
      const resource = await resources.getBySlug(resourceSlug);

      if (!topic || !resource) {
        throw new ApolloError(
          'Topic resource not found.',
          'TOPIC_RESOURCE_NOT_FOUND'
        );
      }

      return {
        topicId: topic.id,
        resourceId: resource.id,
        topic,
        resource,
      };
    },
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
        resource: r,
        alreadyAdded: false,
      }));

      const resourceMap = {};
      availableResources.forEach((r) => {
        resourceMap[r.resource.id] = r;
      });

      const topic = await dataSources.topics.getById(topicId);

      if (!topic) {
        throw new ApolloError('Topic not found.', 'TOPIC_NOT_FOUND');
      }

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
  TopicResource: {
    topic: ({ topicId }, _, { dataSources }) =>
      dataSources.topics.getById(topicId),
    resource: ({ resourceId }, _, { dataSources }) =>
      dataSources.resources.getById(resourceId),
    ratingList: ({ topicId, resourceId }, _, { dataSources }) =>
      dataSources.ratings.getAllForTopicResource(topicId, resourceId),
    createdBy: ({ createdBy }, _, { dataSources }) =>
      dataSources.usersDataSource.getUser(createdBy),
  },
  TopicResourceList: {
    topicResources: async (
      { resourceIds, topicId, resourceSearch },
      _,
      { dataSources }
    ) => {
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
