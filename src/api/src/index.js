const { ApolloServer } = require('apollo-server');
const typeDefs = require('./graphql/type-defs');
const resolvers = require('./graphql/resolvers');

const server = new ApolloServer({ typeDefs, resolvers });

(async () => {
  const serverInfo = await server.listen();
  console.log(`Server started on port ${serverInfo.port}.`);
})();
