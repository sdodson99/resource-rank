const { https, config } = require('firebase-functions');
const firebaseAdmin = require('firebase-admin');
const { createGQLServer } = require('../graphql/create-gql-server');
const openMongoConnection = require('../mongoose/open-connection');
const FirebaseReadOnlyModeDataSource = require('../data-sources/read-only-mode/firebase-read-only-mode-data-source');

const app = firebaseAdmin.initializeApp();
const READ_ONLY_MODE_DATABASE_PATH = '/configuration/read_only_enabled';
const readOnlyModeDataSource = new FirebaseReadOnlyModeDataSource(
  app,
  READ_ONLY_MODE_DATABASE_PATH,
  false
);

const connectionString = config().mongo.connection_string;
openMongoConnection(connectionString);

const gqlServer = createGQLServer({ readOnlyModeDataSource });

exports.api = https.onRequest(gqlServer);
