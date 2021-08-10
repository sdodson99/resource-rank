import useRatingCreator from './use-rating-creator';
import useRatingUpdater from './use-rating-updater';

export default function useRatingSubmitter(
  topicId,
  resourceId,
  existingRating = null
) {
  const { createRating: executeCreateRating, isCreatingRating } =
    useRatingCreator();

  const createRating = async (ratingValue) => {
    const createdRating = await executeCreateRating({
      topicId,
      resourceId,
      ratingValue,
    });

    return createdRating;
  };

  const { updateRating: executeUpdateRating, isUpdatingRating } =
    useRatingUpdater();

  const updateRating = async (ratingValue) => {
    const ratingId = existingRating?.id;

    await executeUpdateRating({
      ratingId,
      ratingValue,
    });

    const updatedRating = {
      id: ratingId,
      value: ratingValue,
    };

    return updatedRating;
  };

  const submitRating = async (ratingValue) => {
    if (!existingRating) {
      return await createRating(ratingValue);
    } else {
      return await updateRating(ratingValue);
    }
  };

  const isSubmittingRating = isUpdatingRating || isCreatingRating;

  return {
    submitRating,
    isSubmittingRating,
  };
}
