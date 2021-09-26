const { gql, ApolloError } = require('apollo-server');

exports.typeDefs = gql`
  type Query {
    topicResources(
      topicId: ID!
      searchOptions: SearchOptionsInput
    ): RootTopicResourceListing
    topicResourceBySlug(
      topicSlug: String!
      resourceSlug: String!
    ): RootTopicResource
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

  type RootTopicResource {
    topic: Topic!
    resource: Resource!
    ratingList: RatingList
    createdBy: User
  }

  type RootTopicResourceListing {
    items: [RootTopicResource]
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
    topicResources: (_, { topicId, searchOptions }, { dataSources }) =>
      dataSources.topicResources.searchByTopicId(topicId, searchOptions),
    topicResourceBySlug: (_, { topicSlug, resourceSlug }, { dataSources }) =>
      dataSources.topicResources.getBySlug(topicSlug, resourceSlug),
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
  RootTopicResource: {
    ratingList: ({ topicId, resourceId }, _, { dataSources }) =>
      dataSources.ratings.getAllForTopicResource(topicId, resourceId),
    createdBy: ({ createdBy }, _, { dataSources }) =>
      dataSources.usersDataSource.getUser(createdBy),
  },
};
