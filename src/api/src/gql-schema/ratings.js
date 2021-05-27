const { gql } = require('apollo-server');

exports.typeDefs = gql`
  type Query {
    userRating(topicId: ID!, resourceId: ID!): Rating
  }

  type Mutation {
    createRating(topicId: ID!, resourceId: ID!, value: Int!): Rating
    updateRating(ratingId: ID!, value: Int!): Boolean
  }

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
`;

exports.resolvers = {
  Query: {
    userRating: (_, { topicId, resourceId }, { dataSources }) =>
      dataSources.ratings.getUserRatingForTopicResource(topicId, resourceId),
  },
  Mutation: {
    createRating: (_, { value, topicId, resourceId }, { dataSources }) =>
      dataSources.ratings.create(topicId, resourceId, value),
    updateRating: (_, { ratingId, value }, { dataSources }) =>
      dataSources.ratings.update(ratingId, value),
  },
  Rating: {
    createdBy: ({ createdBy }, _, { dataSources }) =>
      dataSources.usersDataSource.getUser(createdBy),
  },
  RatingList: {
    average: (ratings) => {
      const hasRatings = ratings && ratings.length > 0;
      if (!hasRatings) {
        return 0;
      }

      const ratingTotal = ratings
        .map((r) => r.value)
        .reduce((total, value) => (total += value), 0);

      return ratingTotal / ratings.length;
    },
    count: (ratings) => {
      if (!ratings) {
        return 0;
      }

      return ratings.length;
    },
    sum: (ratings) => {
      if (!ratings) {
        return 0;
      }

      return ratings
        .map((r) => r.value)
        .reduce((total, value) => (total += value), 0);
    },
    ratings: (ratings) => ratings,
  },
};
