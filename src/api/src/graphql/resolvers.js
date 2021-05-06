const { ApolloError } = require('apollo-server');
const { Topic } = require('../mongoose/models/topic');
const { Resource } = require('../mongoose/models/resource');
const { Rating } = require('../mongoose/models/rating');

const resolvers = {
  Query: {
    topics: () => Topic.find({}),
    topic: (_, { id }) => Topic.findOne({ _id: id }),
    topicExists: (_, { name }) => Topic.exists({ name }),
    topicResource: (_, { topicId, resourceId }) => ({
      topicId,
      resourceId,
    }),
    resources: () => Resource.find({}),
    resource: (_, { id }) => Resource.findOne({ _id: id }),
    resourceExists: (_, { name }) => Resource.exists({ name }),
    availableResources: async (
      _,
      { topicId, search = null, offset = 0, limit = 20 }
    ) => {
      let resourceQuery;

      if (search) {
        resourceQuery = Resource.find({
          name: { $regex: search, $options: 'i' },
        });
      } else {
        resourceQuery = Resource.find({});
      }

      const resourceDTOs = await resourceQuery.skip(offset).limit(limit);
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
    resource: async ({ topicId, resourceId }, _, { resourceDataLoader }) => {
      const resource = await resourceDataLoader.load(resourceId);

      return {
        id: resource._id,
        name: resource.name,
        link: resource.link,
      };
    },
    ratings: async ({ topicId, resourceId }, _, { ratingDataLoader }) => {
      const ratings = await ratingDataLoader.load({
        topic: topicId,
        resource: resourceId,
      });

      return ratings;
    },
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
    createRating: (_, { value, topicId, resourceId }) => {
      if (value < 0 || value > 5) {
        throw new ApolloError(
          'Rating must be between 0 and 5.',
          'INVALID_RATING'
        );
      }

      return Rating.create({
        value,
        topic: topicId,
        resource: resourceId,
      });
    },
  },
};

module.exports = resolvers;
