const { ApolloServer, gql, ApolloError } = require('apollo-server');
const { v4: createUUID } = require('uuid');

const topics = [
  {
    id: createUUID(),
    name: 'Design Patterns',
    resources: [
      {
        id: createUUID(),
        name: 'GOF Book',
        link: 'www.gof.com',
        ratings: [
          {
            id: createUUID(),
            value: 5,
          },
          {
            id: createUUID(),
            value: 3,
          },
          {
            id: createUUID(),
            value: 2,
          },
        ],
      },
    ],
  },
];

const typeDefs = gql`
  type Rating {
    id: ID!
    value: Int!
  }

  type Resource {
    id: ID!
    name: String!
    link: String
    ratings: [Rating]
  }

  type Topic {
    id: ID!
    name: String!
    resources: [Resource]
  }

  type Query {
    topics: [Topic]
    resources: [Resource]
  }

  type Mutation {
    createTopic(name: String!): Topic
    createResource(topicId: ID!, name: String!, link: String): Resource
    createRating(topicId: ID!, resourceId: ID!, value: Int!): Rating
  }
`;

const resolvers = {
  Query: {
    topics: () => topics,
    resources: () => topics.flatMap((t) => t.resources),
  },
  Mutation: {
    createTopic: (_, { name }) => {
      const topic = {
        id: createUUID(),
        name,
      };

      topics.push(topic);

      return topic;
    },
    createResource: (_, { topicId, name, link }) => {
      const topic = topics.find((t) => t.id === topicId);

      if (!topic) {
        throw new ApolloError('Topic not found.', 'TOPIC_NOT_FOUND');
      }

      const resource = {
        id: createUUID(),
        name,
        link,
      };

      topic.resources.push(resource);

      return resource;
    },
    createRating: (_, { topicId, resourceId, value }) => {
      const topic = topics.find((t) => t.id === topicId);

      if (!topic) {
        throw new ApolloError('Topic not found.', 'TOPIC_NOT_FOUND');
      }

      const resource = topic.resources.find((r) => r.id === resourceId);

      if (!resource) {
        throw new ApolloError('Resource not found.', 'RESOURCE_NOT_FOUND');
      }

      const rating = {
        id: createUUID(),
        value,
      };

      resource.ratings.push(rating);

      return rating;
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

(async () => {
  const serverInfo = await server.listen();
  console.log(`Server started on port ${serverInfo.port}.`);
})();
