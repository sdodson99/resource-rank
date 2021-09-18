const { mergeTypeDefs, mergeResolvers } = require('@graphql-tools/merge');
const { typeDefs: commonTypeDefs } = require('./common');
const {
  typeDefs: topicsTypeDefs,
  resolvers: topicsResolvers,
} = require('./topics');
const {
  typeDefs: resourcesTypeDefs,
  resolvers: resourcesResolvers,
} = require('./resources');
const {
  typeDefs: topicResourcesTypeDefs,
  resolvers: topicResourcesResolvers,
} = require('./topic-resources');
const {
  typeDefs: ratingsTypeDefs,
  resolvers: ratingsResolvers,
} = require('./ratings');
const { typeDefs: userTypeDefs, resolvers: usersResolvers } = require('./user');
const {
  typeDefs: configurationTypeDefs,
  resolvers: configurationResolvers,
} = require('./configuration');
const {
  typeDefs: featureFlagsTypeDefs,
  resolvers: featureFlagsResolvers,
} = require('./feature-flags');

exports.typeDefs = mergeTypeDefs([
  commonTypeDefs,
  topicsTypeDefs,
  resourcesTypeDefs,
  topicResourcesTypeDefs,
  ratingsTypeDefs,
  userTypeDefs,
  configurationTypeDefs,
  featureFlagsTypeDefs,
]);

exports.resolvers = mergeResolvers([
  topicsResolvers,
  resourcesResolvers,
  topicResourcesResolvers,
  ratingsResolvers,
  usersResolvers,
  configurationResolvers,
  featureFlagsResolvers,
]);
