const { ApolloServer } = require('apollo-server');
const typeDefs = require('./graphql/type-defs');
const resolvers = require('./graphql/resolvers');
const connect = require('./mongoose/connect');

const MONGODB_CONNECTION_STRING =
  'mongodb://res-rank-admin:res-rank-password@localhost:27017/?authSource=admin&ssl=false';

(async () => {
  await connect(MONGODB_CONNECTION_STRING);

  const server = new ApolloServer({ typeDefs, resolvers });
  const serverInfo = await server.listen();
  console.log(`Server started on port ${serverInfo.port}.`);
})();
