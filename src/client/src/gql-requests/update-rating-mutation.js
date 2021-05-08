import { gql } from '@apollo/client';

export default gql`
  mutation UpdateRatingMutation($ratingId: ID!, $value: Int!) {
    updateRating(ratingId: $ratingId, value: $value)
  }
`;
