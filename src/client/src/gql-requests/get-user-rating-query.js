import { gql } from '@apollo/client';

export default gql`
  query GetUserRating($topicId: ID!, $resourceId: ID!) {
    userRating(topicId: $topicId, resourceId: $resourceId) {
      id
      value
    }
  }
`;
