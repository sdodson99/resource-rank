const { v4: createUUID } = require('uuid');

const users = [
  {
    id: createUUID(),
    username: 'sdodson99',
  },
  {
    id: createUUID(),
    username: 'res-rank-admin',
  },
];

const resources = [
  {
    id: createUUID(),
    name: 'GOF Book Wikipedia',
    link: 'https://en.wikipedia.org/wiki/Design_Patterns',
    creatorId: users.find((u) => u.username === 'sdodson99').id,
  },
  {
    id: createUUID(),
    name: 'Refactoring Guru',
    link: 'https://refactoring.guru/design-patterns',
    creatorId: users.find((u) => u.username === 'sdodson99').id,
  },
  {
    id: createUUID(),
    name: 'Geeks For Geeks',
    link: 'https://www.geeksforgeeks.org/',
    creatorId: users.find((u) => u.username === 'res-rank-admin').id,
  },
  {
    id: createUUID(),
    name: 'Mozilla Developer Documentation',
    link: 'https://developer.mozilla.org/en-US/',
    creatorId: users.find((u) => u.username === 'res-rank-admin').id,
  },
];

const topics = [
  {
    id: createUUID(),
    name: 'Design Patterns',
    creatorId: users.find((u) => u.username === 'sdodson99').id,
    resources: [
      resources.find((r) => r.name === 'GOF Book Wikipedia').id,
      resources.find((r) => r.name === 'Refactoring Guru').id,
      resources.find((r) => r.name === 'Geeks For Geeks').id,
    ],
  },
  {
    id: createUUID(),
    name: 'Algorithms',
    creatorId: users.find((u) => u.username === 'res-rank-admin').id,
    resources: [resources.find((r) => r.name === 'Geeks For Geeks').id],
  },
  {
    id: createUUID(),
    name: 'JavaScript',
    creatorId: users.find((u) => u.username === 'sdodson99').id,
    resources: [],
  },
];

const resolvers = {
  Query: {
    topics: () => topics,
  },
  Topic: {
    resources: (parent) =>
      parent.resources.map((id) => ({
        resource: resources.find((r) => r.id === id),
      })),
  },
  //   Mutation: {
  //     createTopic: (_, { name }) => {
  //       const topic = {
  //         id: createUUID(),
  //         name,
  //       };

  //       topics.push(topic);

  //       return topic;
  //     },
  //     createResource: (_, { topicId, name, link }) => {
  //       const topic = topics.find((t) => t.id === topicId);

  //       if (!topic) {
  //         throw new ApolloError('Topic not found.', 'TOPIC_NOT_FOUND');
  //       }

  //       const resource = {
  //         id: createUUID(),
  //         name,
  //         link,
  //       };

  //       topic.resources.push(resource);

  //       return resource;
  //     },
  //     createRating: (_, { topicId, resourceId, value }) => {
  //       const topic = topics.find((t) => t.id === topicId);

  //       if (!topic) {
  //         throw new ApolloError('Topic not found.', 'TOPIC_NOT_FOUND');
  //       }

  //       const resource = topic.resources.find((r) => r.id === resourceId);

  //       if (!resource) {
  //         throw new ApolloError('Resource not found.', 'RESOURCE_NOT_FOUND');
  //       }

  //       const rating = {
  //         id: createUUID(),
  //         value,
  //       };

  //       resource.ratings.push(rating);

  //       return rating;
  //     },
  //   },
};

module.exports = resolvers;
