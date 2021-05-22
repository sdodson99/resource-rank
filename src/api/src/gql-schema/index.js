const { mergeTypeDefs } = require('@graphql-tools/merge');
const { typeDefs: topicsTypeDefs } = require('./topics');
const { typeDefs: resourcesTypeDefs } = require('./resources');
const { typeDefs: topicResourcesTypeDefs } = require('./topic-resources');
const { typeDefs: ratingsTypeDefs } = require('./ratings');
const { typeDefs: userTypeDefs } = require('./user');
const { typeDefs: configurationTypeDefs } = require('./configuration');

exports.typeDefs = mergeTypeDefs([
  topicsTypeDefs,
  resourcesTypeDefs,
  topicResourcesTypeDefs,
  ratingsTypeDefs,
  userTypeDefs,
  configurationTypeDefs,
]);
