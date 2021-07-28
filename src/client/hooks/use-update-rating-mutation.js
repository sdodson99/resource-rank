import updateRatingMutation from '@/graphql/mutations/update-rating-mutation';
import useLazyGraphQLRequest from './graphql/use-lazy-graphql-request';

export default function useUpdateRatingMutation() {
  const { execute, ...others } = useLazyGraphQLRequest(updateRatingMutation);

  const executeMutation = (ratingId, value) =>
    execute({
      ratingId,
      value,
    });

  return {
    execute: executeMutation,
    ...others,
  };
}
