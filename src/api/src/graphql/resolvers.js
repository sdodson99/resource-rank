const { ApolloError } = require('apollo-server');
const { Topic } = require('../mongoose/models/topic');
const { Resource } = require('../mongoose/models/resource');
const { Rating } = require('../mongoose/models/rating');

const resolvers = {
  Query: {
    topics: async () => {
      const topics = await Topic.find({});

      return topics.map((t) => ({
        id: t._id,
        name: t.name,
        resources: t.resources,
      }));
    },
    topic: async (_, { id }) => {
      const topic = await Topic.findOne({ _id: id });

      return {
        id: topic._id,
        name: topic.name,
        resources: topic.resources,
      };
    },
    topicExists: (_, { name }) => Topic.exists({ name }),
    resources: () => Resource.find({}),
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
    resources: async (
      { id, resources: topicResources },
      _,
      { resourceDataLoader }
    ) => {
      const resourceIds = topicResources
        .filter((r) => r.resource)
        .map((r) => r.resource);

      const resources = await resourceDataLoader.loadMany(resourceIds);
      const loadedTopicResources = resources.map((r) => ({
        topicId: id,
        resource: r,
      }));

      return loadedTopicResources;
    },
  },
  TopicResource: {
    // Resource data loader should probably be used here instead.
    resourceInfo: ({ topicId, resource }) => ({
      id: resource._id,
      name: resource.name,
      link: resource.link,
    }),
    ratings: async ({ topicId, resource }, _, { ratingDataLoader }) => {
      const ratings = await ratingDataLoader.load({
        topic: topicId,
        resource: resource._id,
      });

      return ratings.map((r) => ({
        id: r._id,
        value: r.value,
      }));
    },
  },
  Mutation: {
    createTopic: async (_, { name }) => {
      if (await Topic.exists({ name })) {
        throw new ApolloError('Topic already exists.', 'TOPIC_ALREADY_EXISTS');
      }

      return await Topic.create({ name });
    },
    createResource: (_, { name, link }) => Resource.create({ name, link }),
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
