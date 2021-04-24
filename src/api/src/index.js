require('dotenv').config();
const { ApolloServer } = require('apollo-server');
const typeDefs = require('./graphql/type-defs');
const resolvers = require('./graphql/resolvers');
const openMongoConnection = require('./mongoose/open-connection');
const createResourceDataLoader = require('./graphql/dataloaders/resource-data-loader');
const createRatingDataLoader = require('./graphql/dataloaders/rating-data-loader');

const connectionString = process.env.MONGO_CONNECTION_STRING;

(async () => {
  await openMongoConnection(connectionString);

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: () => {
      return {
        resourceDataLoader: createResourceDataLoader(),
        ratingDataLoader: createRatingDataLoader(),
      };
    },
  });

  const serverInfo = await server.listen();
  console.log(`Server started on port ${serverInfo.port}.`);
})();
