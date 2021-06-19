import { gql } from 'graphql-request';

export default gql`
  mutation UpdateRatingMutation($ratingId: ID!, $value: Int!) {
    updateRating(ratingId: $ratingId, value: $value)
  }
`;
