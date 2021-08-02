const { gql } = require('apollo-server');

exports.typeDefs = gql`
  type Query {
    resources(search: String): [Resource]
    resource(id: ID!): Resource
    resourceBySlug(slug: String!): Resource
    resourceExists(name: String!): Boolean
  }

  type Mutation {
    createResource(name: String!, link: String!): Resource
  }

  type Resource {
    id: ID!
    name: String!
    slug: String
    link: String
    createdBy: User
    verified: Boolean
  }
`;

exports.resolvers = {
  Query: {
    resources: (_, { search = '' }, { dataSources }) =>
      dataSources.resources.search(search),
    resource: (_, { id }, { dataSources }) => dataSources.resources.getById(id),
    resourceBySlug: (_, { slug }, { dataSources }) =>
      dataSources.resources.getBySlug(slug),
    resourceExists: (_, { name }, { dataSources }) =>
      dataSources.resources.nameExists(name),
  },
  Mutation: {
    createResource: (_, { name, link }, { dataSources }) =>
      dataSources.resources.create(name, link),
  },
  Resource: {
    createdBy: ({ createdBy }, _, { dataSources }) =>
      dataSources.usersDataSource.getUser(createdBy),
  },
};
