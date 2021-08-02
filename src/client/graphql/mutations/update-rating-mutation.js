import { gql } from 'graphql-request';

const updateRatingMutation = gql`
  mutation UpdateRating($ratingId: ID!, $value: Int!) {
    updateRating(ratingId: $ratingId, value: $value)
  }
`;

export default updateRatingMutation;
