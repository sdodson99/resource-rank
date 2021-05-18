const { ApolloError, AuthenticationError } = require('apollo-server');
const { Topic } = require('../mongoose/models/topic');
const { Resource } = require('../mongoose/models/resource');
const { Rating } = require('../mongoose/models/rating');

const resolvers = {
  Query: {
    topics: (_, { search = '' }, { dataSources }) =>
      dataSources.topicsDataSource.search(search),
    topic: (_, { id }) => Topic.findOne({ _id: id }),
    topicExists: (_, { name }) => Topic.exists({ name }),
    topicResourceList: async (_, { topicId, resourceSearch = '' }) => {
      const { resources } = await Topic.findOne({ _id: topicId });

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
    resources: () => Resource.find({}),
    resource: (_, { id }) => Resource.findOne({ _id: id }),
    resourceExists: (_, { name }) => Resource.exists({ name }),
    userRating: (_, { topicId, resourceId }, { user }) => {
      if (!user) {
        throw new AuthenticationError();
      }

      const { uid } = user;

      return Rating.findOne({
        topic: topicId,
        resource: resourceId,
        createdBy: uid,
      });
    },
    availableResources: async (
      _,
      { topicId, search = '', offset = 0, limit = 20 }
    ) => {
      const resourceDTOs = await Resource.find({
        name: { $regex: search, $options: 'i' },
      })
        .skip(offset)
        .limit(limit);

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

      const topic = await Topic.findOne({ _id: topicId });
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
    resources: async ({ id, resources }, _, { resourceDataLoader }) => {
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
    topic: ({ topicId }) => Topic.findOne({ _id: topicId }),
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
    topicResources: async ({ topicResources, topicId, resourceSearch }) => {
      const resourceIds = topicResources.map((tr) => tr.resourceId);
      const filteredResources = await Resource.find({
        _id: { $in: resourceIds },
        name: { $regex: resourceSearch, $options: 'i' },
      });

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
    createTopic: async (_, { name }, { user }) => {
      if (!user) {
        throw new AuthenticationError();
      }

      if (await Topic.exists({ name })) {
        throw new ApolloError('Topic already exists.', 'TOPIC_ALREADY_EXISTS');
      }

      const { uid } = user;

      return await Topic.create({ name, createdBy: uid });
    },
    createResource: async (_, { name, link }, { user }) => {
      if (!user) {
        throw new AuthenticationError();
      }

      if (await Resource.exists({ name })) {
        throw new ApolloError(
          'Resource already exists.',
          'RESOURCE_ALREADY_EXISTS'
        );
      }

      const { uid } = user;

      return await Resource.create({ name, link, createdBy: uid });
    },
    createTopicResource: async (_, { topicId, resourceId }, { user }) => {
      if (!user) {
        throw new AuthenticationError();
      }

      const topic = await Topic.findOne({ _id: topicId });
      const existingTopicResource = topic.resources.find(
        (r) => r.resource == resourceId
      );

      if (existingTopicResource) {
        throw new ApolloError(
          'Topic resource already exists.',
          'TOPIC_RESOURCE_ALREADY_EXISTS'
        );
      }

      const { uid } = user;
      const topicResource = {
        resource: resourceId,
        createdBy: uid,
      };

      const result = await Topic.updateOne(
        { _id: topicId },
        { $addToSet: { resources: topicResource } }
      );

      return result.nModified;
    },
    createRating: async (_, { value, topicId, resourceId }, { user }) => {
      if (!user) {
        throw new AuthenticationError();
      }

      if (value < 0 || value > 5) {
        throw new ApolloError(
          'Rating must be between 0 and 5.',
          'INVALID_RATING'
        );
      }

      const { uid } = user;

      const existingRating = await Rating.findOne({
        topic: topicId,
        resource: resourceId,
        createdBy: uid,
      });

      if (existingRating) {
        throw new ApolloError(
          'A rating already exists for this topic resource.',
          'RATING_ALREADY_EXISTS'
        );
      }

      return await Rating.create({
        value,
        topic: topicId,
        resource: resourceId,
        createdBy: uid,
      });
    },
    updateRating: async (_, { ratingId, value }, { user }) => {
      if (!user) {
        throw new AuthenticationError();
      }

      if (value < 0 || value > 5) {
        throw new ApolloError(
          'Rating must be between 0 and 5.',
          'INVALID_RATING'
        );
      }

      const { uid } = user;

      const { ok } = await Rating.updateOne(
        { _id: ratingId, createdBy: uid },
        { value }
      );

      const success = ok > 0;

      return success;
    },
  },
};

module.exports = resolvers;
