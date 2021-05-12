import { useQuery } from '@apollo/client';
import getTopicNameByIdQuery from '../gql-requests/get-topic-name-by-id-query';

export default function useTopicName(topicId) {
  const { data: topicNameData, error, loading } = useQuery(
    getTopicNameByIdQuery,
    {
      fetchPolicy: 'cache-first',
      variables: {
        id: topicId,
      },
    }
  );

  return {
    topicName: topicNameData?.topic?.name,
    loading,
    error,
  };
}
