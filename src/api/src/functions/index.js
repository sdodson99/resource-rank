const { https, config } = require('firebase-functions');
const firebaseAdmin = require('firebase-admin');
const { createGQLServer } = require('../server/create-gql-server');
const openMongoConnection = require('../mongoose/open-connection');
const ReadOnlyModeDataSource = require('../data-sources/read-only-mode/read-only-mode-data-source');
const FirebaseUserDecoder = require('../authentication/firebase-user-decoder');
const FirebaseUsersDataSource = require('../data-sources/firebase-users-data-source');
const FirebaseFeatureGetAllQuerier = require('../services/feature-flags/get-all-querier');
const FeatureFlagEnabledQuerier = require('../services/feature-flags/enabled-querier');
const FeatureFlagsDataSource = require('../data-sources/feature-flags');

const FEATURE_FLAGS_DATABASE_PATH = '/feature_flags';

const app = firebaseAdmin.initializeApp();
const featureFlagGetAllQuerier = new FirebaseFeatureGetAllQuerier(
  app,
  FEATURE_FLAGS_DATABASE_PATH
);
const featureFlagEnabledQuerier = new FeatureFlagEnabledQuerier(
  featureFlagGetAllQuerier
);
const featureFlagsDataSource = new FeatureFlagsDataSource(
  featureFlagGetAllQuerier,
  featureFlagEnabledQuerier
);
const readOnlyModeDataSource = new ReadOnlyModeDataSource(
  featureFlagEnabledQuerier
);
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
