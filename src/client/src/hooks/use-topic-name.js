import { useQuery } from '@apollo/client';
import getTopicNameByIdQuery from '../gql-requests/get-topic-name-by-id-query';

export default function useTopicName(topicId) {
  const { data: topicNameData } = useQuery(getTopicNameByIdQuery, {
    fetchPolicy: 'cache-first',
    variables: {
      id: topicId,
    },
  });

  return topicNameData?.topic?.name;
}
