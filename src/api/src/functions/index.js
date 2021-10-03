const { https, config } = require('firebase-functions');
const firebaseAdmin = require('firebase-admin');
const { createGQLServer } = require('../server/create-gql-server');
const openMongoConnection = require('../mongoose/open-connection');
const ReadOnlyModeDataSource = require('../data-sources/read-only-mode/read-only-mode-data-source');
const {
  GetAllFeatureFlagsQuery,
} = require('../features/feature-flags/queries/get-all-feature-flags-query');
const {
  FeatureFlagEnabledQuery,
} = require('../features/feature-flags/queries/feature-flag-enabled-query');
const FeatureFlagsDataSource = require('../features/feature-flags/graphql/feature-flags-data-source');

const FEATURE_FLAGS_DATABASE_PATH = '/feature_flags';

const app = firebaseAdmin.initializeApp();
const getAllFeatureFlagsQuery = new GetAllFeatureFlagsQuery(
  app,
  FEATURE_FLAGS_DATABASE_PATH
);
const isFeatureFlagEnabledQuery = new FeatureFlagEnabledQuery(
  getAllFeatureFlagsQuery
);
const featureFlagsDataSource = new FeatureFlagsDataSource(
  getAllFeatureFlagsQuery,
  isFeatureFlagEnabledQuery
);
const readOnlyModeDataSource = new ReadOnlyModeDataSource(
  isFeatureFlagEnabledQuery
);

const connectionString = config().mongo.connection_string;
openMongoConnection(connectionString);

const gqlServer = createGQLServer({
  readOnlyModeDataSource,
  featureFlagsDataSource,
  firebaseApp: app,
});

exports.api = https.onRequest(gqlServer);
