const { gql } = require('apollo-server');

exports.typeDefs = gql`
  type Rating {
    id: ID!
    value: Int!
    createdBy: User
  }

  type RatingList {
    average: Float
    count: Int
    sum: Int
    ratings: [Rating]
  }

  type Query {
    userRating(topicId: ID!, resourceId: ID!): Rating
  }

  type Mutation {
    createRating(topicId: ID!, resourceId: ID!, value: Int!): Rating
    updateRating(ratingId: ID!, value: Int!): Boolean
  }
`;
