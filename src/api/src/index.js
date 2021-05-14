require('dotenv').config();
const openMongoConnection = require('./mongoose/open-connection');
const { createGQLServer } = require('./graphql/create-gql-server');
const InMemoryReadOnlyModeDataSource = require('./data-sources/read-only-mode/in-memory-read-only-mode-data-source');

const connectionString = process.env.MONGO_CONNECTION_STRING;
const port = process.env.PORT;
const readOnlyModeEnabled = process.env.READ_ONLY_MODE_ENABLED === 'true';

const readOnlyModeDataSource = new InMemoryReadOnlyModeDataSource(
  readOnlyModeEnabled
);

(async () => {
  await openMongoConnection(connectionString);

  const gqlServer = createGQLServer({ readOnlyModeDataSource });
  await gqlServer.listen(port);

  console.log(`Server started on port ${port}.`);
})();
