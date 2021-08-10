import useUpdateRatingMutation from '../mutations/use-update-rating-mutation';

export default function useRatingUpdater() {
  const { execute: executeUpdateRatingMutation, isLoading: isUpdatingRating } =
    useUpdateRatingMutation();

  const updateRating = async ({ ratingId, ratingValue }) => {
    const { data: updateRatingData } = await executeUpdateRatingMutation(
      ratingId,
      ratingValue
    );

    const success = updateRatingData?.updateRating;
    if (!success) {
      throw new Error('Failed to update rating.');
    }
  };

  return {
    updateRating,
    isUpdatingRating,
  };
}
