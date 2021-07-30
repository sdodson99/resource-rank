import createRatingMutation from '@/graphql/mutations/create-rating-mutation';
import useLazyGraphQLRequest from '../graphql/use-lazy-graphql-request';

export default function useCreateRatingMutation() {
  const { execute, ...others } = useLazyGraphQLRequest(createRatingMutation);

  const executeMutation = (topicId, resourceId, ratingValue) =>
    execute({ topicId, resourceId, value: ratingValue });

  return {
    execute: executeMutation,
    ...others,
  };
}
