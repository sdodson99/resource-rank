import { gql } from 'graphql-request';

const userRatingQuery = gql`
  query UserRating($topicId: ID!, $resourceId: ID!) {
    userRating(topicId: $topicId, resourceId: $resourceId) {
      id
      value
    }
  }
`;

export default userRatingQuery;
