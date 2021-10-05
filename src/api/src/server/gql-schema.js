const { mergeTypeDefs, mergeResolvers } = require('@graphql-tools/merge');
const {
  typeDefs: commonTypeDefs,
} = require('../features/common/graphql/common-schema');
const {
  typeDefs: topicsTypeDefs,
  resolvers: topicsResolvers,
} = require('../features/topics/graphql/topics-schema');
const {
  typeDefs: resourcesTypeDefs,
  resolvers: resourcesResolvers,
} = require('../features/resources/graphql/resources-schema');
const {
  typeDefs: topicResourcesTypeDefs,
  resolvers: topicResourcesResolvers,
} = require('../features/topic-resources/graphql/topic-resources-schema');
const {
  typeDefs: ratingsTypeDefs,
  resolvers: ratingsResolvers,
} = require('../features/ratings/graphql/ratings-schema');
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
