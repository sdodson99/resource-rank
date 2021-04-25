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
    resources: () => Resource.find({}),
  },
  Topic: {
    resources: async (
      { id, resources: resourceIds },
      _,
      { resourceDataLoader }
    ) => {
      const resources = await resourceDataLoader.loadMany(resourceIds);
      const topicResources = resources.map((r) => ({
        topicId: id,
        resource: r,
      }));

      return topicResources;
    },
  },
  TopicResource: {
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
    createTopic: (_, { name }) => Topic.create({ name }),
    createResource: (_, { name, link }) => Resource.create({ name, link }),
    createTopicResource: async (_, { topicId, resourceId }) => {
      const result = await Topic.updateOne(
        { _id: topicId },
        { $addToSet: { resources: resourceId } }
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
