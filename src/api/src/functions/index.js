const { https, config } = require('firebase-functions');
const firebaseAdmin = require('firebase-admin');
const { createGQLServer } = require('../server/create-gql-server');
const openMongoConnection = require('../mongoose/open-connection');
const FirebaseReadOnlyModeDataSource = require('../data-sources/read-only-mode/firebase-read-only-mode-data-source');
const FirebaseUserDecoder = require('../authentication/firebase-user-decoder');
const FirebaseUsersDataSource = require('../data-sources/firebase-users-data-source');

const app = firebaseAdmin.initializeApp();
const READ_ONLY_MODE_DATABASE_PATH = '/configuration/read_only_enabled';
const readOnlyModeDataSource = new FirebaseReadOnlyModeDataSource(
  app,
  READ_ONLY_MODE_DATABASE_PATH,
  false
);
const usersDataSource = new FirebaseUsersDataSource(app);
const userDecoder = new FirebaseUserDecoder(app);

const connectionString = config().mongo.connection_string;
openMongoConnection(connectionString);

const gqlServer = createGQLServer({
  readOnlyModeDataSource,
  usersDataSource,
  userDecoder,
});

exports.api = https.onRequest(gqlServer);
