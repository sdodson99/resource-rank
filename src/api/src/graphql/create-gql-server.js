const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./type-defs');
const resolvers = require('./resolvers');
const createResourceDataLoader = require('./dataloaders/resource-data-loader');
const createRatingDataLoader = require('./dataloaders/rating-data-loader');

exports.createGQLServer = () => {
  const app = express();

  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    context: () => {
      return {
        resourceDataLoader: createResourceDataLoader(),
        ratingDataLoader: createRatingDataLoader(),
      };
    },
  });

  apolloServer.applyMiddleware({ app, path: '/', cors: true });

  return app;
};
