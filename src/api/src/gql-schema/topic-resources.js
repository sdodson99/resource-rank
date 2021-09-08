const { gql, ApolloError } = require('apollo-server');

exports.typeDefs = gql`
  type Query {
    topicResources(
      topicId: ID!
      resourceSearch: String
      offset: Int
      limit: Int
    ): TopicResourceListing
    topicResource(topicId: ID!, resourceId: ID!): TopicResource
    topicResourceBySlug(
      topicSlug: String!
      resourceSlug: String!
    ): TopicResource
    availableResources(
      topicId: ID!
      search: String
      offset: Int
      limit: Int
    ): AvailableResourceListing
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

  type TopicResourceListing {
    items: [TopicResource]
    totalCount: Int!
  }

  type AvailableResource {
    resource: Resource!
    alreadyAdded: Boolean
  }

  type AvailableResourceListing {
    items: [AvailableResource]
    totalCount: Int
  }
`;

exports.resolvers = {
  Query: {
    topicResources: async (
      _,
      { topicId, resourceSearch, offset = 0, limit = 20 },
      { dataSources }
    ) => {
      const topic = await dataSources.topics.getById(topicId);

      if (!topic || !topic.resources) {
        return {
          items: [],
          totalCount: 0,
        };
      }

      let resourceIds = [];
      if (topic && topic.resources) {
        resourceIds = topic.resources.map((r) => r.resource);
      }

      // TODO: Clean up this spaghetti
      const filteredResources = await dataSources.resources.getByIds(
        resourceIds,
        resourceSearch
      );

      const topicResources = filteredResources.map((r) => ({
        topicId,
        resourceId: r._id,
        resource: r,
        topic,
        createdBy: r.createdBy,
      }));

      const topicResourceRatings = await dataSources.ratings.getAllForManyTopicResources(
        topicResources
      );

      const ratedTopicResources = [];

      for (let index = 0; index < topicResources.length; index++) {
        const currentTopicResource = topicResources[index];
        const currentTopicResourceRatings = topicResourceRatings[index];

        const ratingSum = currentTopicResourceRatings
          .map((r) => r.value)
          .reduce((prev, curr) => prev + curr, 0);
        const ratingCount = currentTopicResourceRatings.length;
        const averageRating = ratingCount === 0 ? 0 : ratingSum / ratingCount;

        ratedTopicResources.push({
          ...currentTopicResource,
          averageRating,
        });
      }

      ratedTopicResources.sort(
        (tr1, tr2) =>
          tr2.resource.verified - tr1.resource.verified ||
          tr2.averageRating - tr1.averageRating
      );

      const paginatedTopicResources = ratedTopicResources.slice(
        offset,
        offset + limit
      );

      return {
        items: paginatedTopicResources,
        totalCount: filteredResources.length,
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
      { topicId, search, offset, limit },
      { dataSources }
    ) => {
      const { items, totalCount } = await dataSources.resources.search(search, {
        offset,
        limit,
      });

      const availableResourceItems = items.map((resource) => ({
        resource,
        alreadyAdded: false,
      }));

      const availableResourceMap = {};
      availableResourceItems.forEach((a) => {
        availableResourceMap[a.resource.id] = a;
      });

      const topic = await dataSources.topics.getById(topicId);

      if (!topic) {
        throw new ApolloError('Topic not found.', 'TOPIC_NOT_FOUND');
      }

      topic.resources.forEach((resource) => {
        const { resource: resourceId } = resource;

        if (availableResourceMap[resourceId]) {
          availableResourceMap[resourceId].alreadyAdded = true;
        }
      });

      return {
        items: availableResourceItems,
        totalCount,
      };
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
};
