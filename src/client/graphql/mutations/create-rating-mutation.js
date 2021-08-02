import { gql } from 'graphql-request';

const createRatingMutation = gql`
  mutation CreateRating($topicId: ID!, $resourceId: ID!, $value: Int!) {
    createRating(topicId: $topicId, resourceId: $resourceId, value: $value) {
      id
      value
    }
  }
`;

export default createRatingMutation;
