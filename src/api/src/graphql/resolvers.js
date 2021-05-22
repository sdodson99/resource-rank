const resolvers = {
  Query: {
    topics: (_, { search = '' }, { dataSources }) =>
      dataSources.topics.search(search),
    topic: (_, { id }, { dataSources }) => dataSources.topics.getById(id),
    topicExists: (_, { name }, { dataSources }) =>
      dataSources.topics.nameExists(name),
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
    resources: (_, { search = '' }, { dataSources }) =>
      dataSources.resources.search(search),
    resource: (_, { id }, { dataSources }) => dataSources.resources.getById(id),
    resourceExists: (_, { name }, { dataSources }) =>
      dataSources.resources.nameExists(name),
    userRating: (_, { topicId, resourceId }, { dataSources }) =>
      dataSources.ratings.getUserRatingForTopicResource(topicId, resourceId),
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
    readOnlyModeEnabled: (_, __, { dataSources }) =>
      dataSources.readOnlyModeDataSource.isReadOnlyEnabled(),
  },
  AvailableResource: {
    createdBy: ({ createdBy }, _, { dataSources }) =>
      dataSources.usersDataSource.getUser(createdBy),
  },
  Topic: {
    resources: ({ id, resources }) => {
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
  Resource: {
    createdBy: ({ createdBy }, _, { dataSources }) =>
      dataSources.usersDataSource.getUser(createdBy),
  },
  Rating: {
    createdBy: ({ createdBy }, _, { dataSources }) =>
      dataSources.usersDataSource.getUser(createdBy),
  },
  TopicResource: {
    topic: ({ topicId }, _, { dataSources }) =>
      dataSources.topics.getById(topicId),
    resource: ({ topicId, resourceId }, _, { resourceDataLoader }) =>
      resourceDataLoader.load(resourceId),
    ratingList: ({ topicId, resourceId }, _, { ratingDataLoader }) =>
      ratingDataLoader.load({
        topic: topicId,
        resource: resourceId,
      }),
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
  RatingList: {
    average: (ratings) => {
      const hasRatings = ratings && ratings.length > 0;
      if (!hasRatings) {
        return 0;
      }

      const ratingTotal = ratings
        .map((r) => r.value)
        .reduce((total, value) => (total += value), 0);

      return ratingTotal / ratings.length;
    },
    count: (ratings) => {
      if (!ratings) {
        return 0;
      }

      return ratings.length;
    },
    sum: (ratings) => {
      if (!ratings) {
        return 0;
      }

      return ratings
        .map((r) => r.value)
        .reduce((total, value) => (total += value), 0);
    },
    ratings: (ratings) => ratings,
  },
  User: {
    id: ({ uid }) => uid,
    username: ({ displayName }) => displayName,
  },
  Mutation: {
    createTopic: (_, { name }, { dataSources }) =>
      dataSources.topics.create(name),
    createResource: (_, { name, link }, { dataSources }) =>
      dataSources.resources.create(name, link),
    createTopicResource: (_, { topicId, resourceId }, { dataSources }) =>
      dataSources.topics.addResource(topicId, resourceId),
    createRating: (_, { value, topicId, resourceId }, { dataSources }) =>
      dataSources.ratings.create(topicId, resourceId, value),
    updateRating: (_, { ratingId, value }, { dataSources }) =>
      dataSources.ratings.update(ratingId, value),
  },
};

module.exports = resolvers;
