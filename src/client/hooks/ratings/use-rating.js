import { useEffect, useState } from 'react';
import useTopicResourceUserRatingQuery from '../queries/use-topic-resource-user-rating-query';

export default function useRating(topicId, resourceId, isLoggedIn) {
  const [rating, setRating] = useState();

  const {
    execute: executeRatingQuery,
    data: ratingData,
    error,
    isLoading: isQueryLoading,
    isInitialized,
  } = useTopicResourceUserRatingQuery(topicId, resourceId);

  useEffect(async () => {
    if (isLoggedIn) {
      await executeRatingQuery();
    } else {
      setRating(null);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    const rating = ratingData?.userRating;
    setRating(rating);
  }, [ratingData]);

  const isLoading = isQueryLoading || !isInitialized;

  return {
    rating,
    isLoading,
    error,
  };
}
