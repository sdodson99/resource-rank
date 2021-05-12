const { ApolloError } = require('apollo-server');
const { Topic } = require('../mongoose/models/topic');
const { Resource } = require('../mongoose/models/resource');
const { Rating } = require('../mongoose/models/rating');

const resolvers = {
  Query: {
    topics: (_, { name = '' }) =>
      Topic.find({ name: { $regex: name, $options: 'i' } }),
    topic: (_, { id }) => Topic.findOne({ _id: id }),
    topicExists: (_, { name }) => Topic.exists({ name }),
    topicResources: async (_, { topicId }) => {
      const { resources } = await Topic.findOne({ _id: topicId });

      return resources.map((r) => ({
        topicId: topicId,
        resourceId: r.resource,
      }));
    },
    topicResource: (_, { topicId, resourceId }) => ({
      topicId,
      resourceId,
    }),
    resources: () => Resource.find({}),
    resource: (_, { id }) => Resource.findOne({ _id: id }),
    resourceExists: (_, { name }) => Resource.exists({ name }),
    userRating: (_, { topicId, resourceId }) =>
      Rating.findOne({ topic: topicId, resource: resourceId }),
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
  },
  Topic: {
    resources: async ({ id, resources }, _, { resourceDataLoader }) => {
      const topicResources = resources
        .filter((r) => r.resource)
        .map((r) => ({
          topicId: id,
          resourceId: r.resource,
        }));

      return topicResources;
    },
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
  },
  RatingList: {
    average: (ratings) => {
      const hasRatings = ratings && ratings.length > 0;
      if (!hasRatings) {
        return 0;
      }

      const ratingTotal = ratings
        .map((r) => r.value)
        .filter((r) => r >= 0 && r <= 5)
        .reduce((total, value) => (total += value), 0);

      return ratingTotal / ratings.length;
    },
    ratings: (ratings) => ratings,
  },
  Mutation: {
    createTopic: async (_, { name }) => {
      if (await Topic.exists({ name })) {
        throw new ApolloError('Topic already exists.', 'TOPIC_ALREADY_EXISTS');
      }

      return await Topic.create({ name });
    },
    createResource: async (_, { name, link }) => {
      if (await Resource.exists({ name })) {
        throw new ApolloError(
          'Resource already exists.',
          'RESOURCE_ALREADY_EXISTS'
        );
      }

      return await Resource.create({ name, link });
    },
    createTopicResource: async (_, { topicId, resourceId }) => {
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

      const topicResource = {
        resource: resourceId,
      };

      const result = await Topic.updateOne(
        { _id: topicId },
        { $addToSet: { resources: topicResource } }
      );

      return result.nModified;
    },
    createRating: async (_, { value, topicId, resourceId }) => {
      if (value < 0 || value > 5) {
        throw new ApolloError(
          'Rating must be between 0 and 5.',
          'INVALID_RATING'
        );
      }

      const existingRating = await Rating.findOne({
        topic: topicId,
        resource: resourceId,
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
      });
    },
    updateRating: async (_, { ratingId, value }) => {
      if (value < 0 || value > 5) {
        throw new ApolloError(
          'Rating must be between 0 and 5.',
          'INVALID_RATING'
        );
      }

      const { ok } = await Rating.updateOne({ _id: ratingId }, { value });

      const success = ok > 0;

      return success;
    },
  },
};

module.exports = resolvers;
