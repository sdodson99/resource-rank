const { mergeTypeDefs, mergeResolvers } = require('@graphql-tools/merge');
const { typeDefs: commonTypeDefs } = require('./common');
const {
  typeDefs: topicsTypeDefs,
  resolvers: topicsResolvers,
} = require('./topics');
const {
  typeDefs: resourcesTypeDefs,
  resolvers: resourcesResolvers,
} = require('../features/resources/graphql/resources-schema');
const {
  typeDefs: topicResourcesTypeDefs,
  resolvers: topicResourcesResolvers,
} = require('./topic-resources');
const {
  typeDefs: ratingsTypeDefs,
  resolvers: ratingsResolvers,
} = require('./ratings');
const {
  typeDefs: userTypeDefs,
} = require('../features/users/graphql/users-schema');
const {
  typeDefs: featureFlagsTypeDefs,
  resolvers: featureFlagsResolvers,
} = require('../features/feature-flags/graphql/feature-flags-schema');

exports.typeDefs = mergeTypeDefs([
  commonTypeDefs,
  topicsTypeDefs,
  resourcesTypeDefs,
  topicResourcesTypeDefs,
  ratingsTypeDefs,
  userTypeDefs,
  featureFlagsTypeDefs,
]);

exports.resolvers = mergeResolvers([
  topicsResolvers,
  resourcesResolvers,
  topicResourcesResolvers,
  ratingsResolvers,
  featureFlagsResolvers,
]);
