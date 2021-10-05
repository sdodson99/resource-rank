const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { typeDefs, resolvers } = require('./gql-schema');
const MongoTopicsDataSource = require('../data-sources/topics/mongo-topics-data-source');
const {
  ResourcesDataSource,
} = require('../features/resources/graphql/resources-data-source');
const MongoRatingsDataSource = require('../data-sources/ratings/mongo-ratings-data-source');
const createReadOnlyModeHandler = require('./middleware/handle-read-only-mode');
const TopicResourcesDataSource = require('../data-sources/topic-resources/topic-resources-data-source');
const {
  UsersDataSource,
} = require('../features/users/graphql/users-data-source');
const { Authenticator } = require('../features/authentication/authenticator');

exports.createGQLServer = ({
  readOnlyModeDataSource,
  featureFlagsDataSource,
  firebaseApp,
}) => {
  const app = express();

  const authenticator = new Authenticator(firebaseApp);

  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => {
      const user = await authenticator.authenticate(req);

      return {
        user,
      };
    },
    dataSources: () => {
      // Data sources that use this.context should be instantiated in this method.
      const topics = new MongoTopicsDataSource();
      const resources = new ResourcesDataSource();
      const ratings = new MongoRatingsDataSource();
      const topicResources = new TopicResourcesDataSource(
        topics,
        resources,
        ratings
      );
      const users = new UsersDataSource(firebaseApp);

      return {
        users,
        topics,
        resources,
        ratings,
        topicResources,
        featureFlags: featureFlagsDataSource,
      };
    },
  });

  app.use(createReadOnlyModeHandler(readOnlyModeDataSource));

  apolloServer.applyMiddleware({ app, path: '/', cors: true });

  return app;
};
