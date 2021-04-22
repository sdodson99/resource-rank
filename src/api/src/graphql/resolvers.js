const { Topic } = require('../mongoose/models/topic');
const { Resource } = require('../mongoose/models/resource');

const resolvers = {
  Query: {
    topics: () => Topic.find({}),
    resources: () => Resource.find({}),
  },
  Mutation: {
    createTopic: (_, { name }) => Topic.create({ name }),
    createResource: (_, { name, link }) => Resource.create({ name, link }),
  },
};

module.exports = resolvers;
