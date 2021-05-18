import { useApolloClient } from '@apollo/client';
import getUserRatingQuery from '../gql-requests/get-user-rating-query';

export default function useTopicResourceUserRating() {
  const apolloClient = useApolloClient();

  const getUserRating = async (topicId, resourceId) => {
    const { data, error } = await apolloClient.query({
      query: getUserRatingQuery,
      variables: {
        topicId,
        resourceId,
      },
    });

    if (error) {
      throw error;
    }

    return data?.userRating;
  };

  return {
    getUserRating,
  };
}
