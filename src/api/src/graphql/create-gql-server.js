const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./type-defs');
const resolvers = require('./resolvers');
const createResourceDataLoader = require('./dataloaders/resource-data-loader');
const createRatingDataLoader = require('./dataloaders/rating-data-loader');
const MongoTopicsDataSource = require('../data-sources/topics/mongo-topics-data-source');

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
        resourceDataLoader: createResourceDataLoader(),
        ratingDataLoader: createRatingDataLoader(),
      };
    },
    dataSources: () => {
      // Careful here. Apollo recommends instantiating new data sources in
      // this method IF we use this.context in the data source.
      return {
        readOnlyModeDataSource,
        usersDataSource,
        topicsDataSource: new MongoTopicsDataSource(),
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
