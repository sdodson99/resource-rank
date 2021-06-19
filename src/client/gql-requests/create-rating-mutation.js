import { gql } from 'graphql-request';

export default gql`
  mutation CreateRatingMutation($topicId: ID!, $resourceId: ID!, $value: Int!) {
    createRating(topicId: $topicId, resourceId: $resourceId, value: $value) {
      id
      value
    }
  }
`;
