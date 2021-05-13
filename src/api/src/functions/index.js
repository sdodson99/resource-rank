const { https, config } = require('firebase-functions');
const { createGQLServer } = require('../graphql/create-gql-server');
const openMongoConnection = require('../mongoose/open-connection');

const connectionString = config().mongo.connectionString;
openMongoConnection(connectionString);

const gqlServer = createGQLServer();

exports.api = https.onRequest(gqlServer);
