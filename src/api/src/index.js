require('dotenv').config();
const openMongoConnection = require('./mongoose/open-connection');
const { createGQLServer } = require('./graphql/create-gql-server');

const connectionString = process.env.MONGO_CONNECTION_STRING;
const port = process.env.PORT;

(async () => {
  await openMongoConnection(connectionString);

  const gqlServer = createGQLServer();
  await gqlServer.listen(port);

  console.log(`Server started on port ${port}.`);
})();
