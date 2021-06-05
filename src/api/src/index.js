require('dotenv').config();
const firebaseAdmin = require('firebase-admin');
const openMongoConnection = require('./mongoose/open-connection');
const { createGQLServer } = require('./server/create-gql-server');
const FirebaseUserDecoder = require('./authentication/firebase-user-decoder');
const FirebaseUsersDataSource = require('./data-sources/firebase-users-data-source');
const InMemoryReadOnlyModeDataSource = require('./data-sources/read-only-mode/in-memory-read-only-mode-data-source');

// NOTE: This is for use without Firebase Functions. However, using Firebase Functions in development
// is recommended in order to match the production environment.

const connectionString = process.env.MONGO_CONNECTION_STRING;
const port = process.env.PORT;
const readOnlyModeEnabled = process.env.READ_ONLY_MODE_ENABLED === 'true';

// Production will need full config.
const app = firebaseAdmin.initializeApp({ projectId: 'resource-rank' });

const usersDataSource = new FirebaseUsersDataSource(app);
const userDecoder = new FirebaseUserDecoder(app);
const readOnlyModeDataSource = new InMemoryReadOnlyModeDataSource(
  readOnlyModeEnabled
);

(async () => {
  await openMongoConnection(connectionString);

  const gqlServer = createGQLServer({
    readOnlyModeDataSource,
    usersDataSource,
    userDecoder,
  });
  await gqlServer.listen(port);

  console.log(`Server started on port ${port}.`);
})();
