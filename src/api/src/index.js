require('dotenv').config();
const { ApolloServer } = require('apollo-server');
const typeDefs = require('./graphql/type-defs');
const resolvers = require('./graphql/resolvers');
const connect = require('./mongoose/connect');

const connectionString = process.env.MONGO_CONNECTION_STRING;

(async () => {
  await connect(connectionString);

  const server = new ApolloServer({ typeDefs, resolvers });
  const serverInfo = await server.listen();
  console.log(`Server started on port ${serverInfo.port}.`);
})();
