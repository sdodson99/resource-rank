const { Topic } = require('../mongoose/models/topic');
const { Resource } = require('../mongoose/models/resource');

const resolvers = {
  Query: {
    topics: async () => {
      const topics = await Topic.find({}).populate('resources');

      return topics.map((t) => {
        return {
          id: t._id,
          name: t.name,
          resources: t.resources.map((r) => {
            return {
              resource: {
                id: r._id,
                name: r.name,
                link: r.link,
              },
            };
          }),
        };
      });
    },
    resources: () => Resource.find({}),
  },
  Mutation: {
    createTopic: (_, { name }) => Topic.create({ name }),
    createResource: (_, { name, link }) => Resource.create({ name, link }),
  },
};

module.exports = resolvers;
