import useCreateRatingMutation from '../mutations/use-create-rating-mutation';

export default function useRatingCreator() {
  const { execute: executeCreateRatingMutation, isLoading: isCreatingRating } =
    useCreateRatingMutation();

  const createRating = async ({ topicId, resourceId, ratingValue }) => {
    const { data: createRatingData } = await executeCreateRatingMutation(
      topicId,
      resourceId,
      ratingValue
    );

    const createdRating = createRatingData?.createRating;
    if (!createdRating) {
      throw new Error('Failed to create rating.');
    }

    return createdRating;
  };

  return {
    createRating,
    isCreatingRating,
  };
}
