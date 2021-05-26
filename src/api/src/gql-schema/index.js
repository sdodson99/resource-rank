const { mergeTypeDefs, mergeResolvers } = require('@graphql-tools/merge');
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

exports.typeDefs = mergeTypeDefs([
  topicsTypeDefs,
  resourcesTypeDefs,
  topicResourcesTypeDefs,
  ratingsTypeDefs,
  userTypeDefs,
  configurationTypeDefs,
]);

exports.resolvers = mergeResolvers([
  topicsResolvers,
  resourcesResolvers,
  topicResourcesResolvers,
  ratingsResolvers,
  usersResolvers,
  configurationResolvers,
]);