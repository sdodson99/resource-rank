const { https, config } = require('firebase-functions');
const firebaseAdmin = require('firebase-admin');
const { createGQLServer } = require('../server/create-gql-server');
const openMongoConnection = require('../mongoose/open-connection');
const ReadOnlyModeDataSource = require('../data-sources/read-only-mode/read-only-mode-data-source');
const FirebaseUserDecoder = require('../authentication/firebase-user-decoder');
const FirebaseUsersDataSource = require('../data-sources/firebase-users-data-source');
const FirebaseFeatureFlagLoader = require('../services/feature-flag-loaders');
const FeatureFlagsDataSource = require('../data-sources/feature-flags');

const FEATURE_FLAGS_DATABASE_PATH = '/feature_flags';

const app = firebaseAdmin.initializeApp();
const featureFlagLoader = new FirebaseFeatureFlagLoader(
  app,
  FEATURE_FLAGS_DATABASE_PATH
);
const featureFlagsDataSource = new FeatureFlagsDataSource(featureFlagLoader);
const readOnlyModeDataSource = new ReadOnlyModeDataSource(featureFlagLoader);
const usersDataSource = new FirebaseUsersDataSource(app);
const userDecoder = new FirebaseUserDecoder(app);

const connectionString = config().mongo.connection_string;
openMongoConnection(connectionString);

const gqlServer = createGQLServer({
  readOnlyModeDataSource,
  usersDataSource,
  userDecoder,
  featureFlagsDataSource,
});

exports.api = https.onRequest(gqlServer);
