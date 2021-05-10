import { useQuery } from '@apollo/client';
import getUserRatingQuery from '../gql-requests/get-user-rating-query';

export default function useTopicResourceUserRating(topicId, resourceId) {
  const { data: userRatingData, loading, error } = useQuery(
    getUserRatingQuery,
    {
      variables: {
        topicId,
        resourceId,
      },
    }
  );

  const userRating = userRatingData?.userRating;

  return {
    userRating,
    loading,
    error,
  };
}
