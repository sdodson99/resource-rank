const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./type-defs');
const resolvers = require('./resolvers');
const createResourceDataLoader = require('./dataloaders/resource-data-loader');
const createRatingDataLoader = require('./dataloaders/rating-data-loader');

const isMutation = (req) => {
  const query = req.body.query;

  return query && query.trim().startsWith('mutation');
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
      return {
        readOnlyModeDataSource,
        usersDataSource,
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
