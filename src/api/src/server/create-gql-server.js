const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { typeDefs, resolvers } = require('../gql-schema/index');
const MongoTopicsDataSource = require('../data-sources/topics/mongo-topics-data-source');
const MongoResourcesDataSource = require('../data-sources/resources/mongo-resources-data-source');
const MongoRatingsDataSource = require('../data-sources/ratings/mongo-ratings-data-source');

const isMutation = (req) => {
  const { body } = req;
  if (!body) {
    return false;
  }

  const { query } = body;
  if (!query) {
    return false;
  }

  return query.trim().startsWith('mutation');
};

exports.createGQLServer = ({
  readOnlyModeDataSource,
  userDecoder,
  usersDataSource,
}) => {
  const app = express();

  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => {
      const user = await userDecoder.getUserFromRequest(req);

      return {
        user,
      };
    },
    dataSources: () => {
      // Careful here. Data sources that use this.context should be
      // instantiated in this method.
      return {
        readOnlyModeDataSource,
        usersDataSource,
        topics: new MongoTopicsDataSource(),
        resources: new MongoResourcesDataSource(),
        ratings: new MongoRatingsDataSource(),
      };
    },
  });

  app.use(async (req, res, next) => {
    if (isMutation(req) && (await readOnlyModeDataSource.isReadOnlyEnabled())) {
      return res.sendStatus(403);
    }
    next();
  });

  apolloServer.applyMiddleware({ app, path: '/', cors: true });

  return app;
};