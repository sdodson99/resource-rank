import { useApolloClient, useQuery } from '@apollo/client';
import getTopicByIdQuery from '../gql-requests/get-topic-by-id-query';
import getTopicNameByIdQuery from '../gql-requests/get-topic-name-by-id-query';

const updateTopicNameByIdQuery = (apolloClient, topicId, topicName) => {
  apolloClient.writeQuery({
    query: getTopicNameByIdQuery,
    variables: { id: topicId },
    data: {
      topic: {
        name: topicName,
      },
    },
  });
};

export default function useTopicById(topicId) {
  const apolloClient = useApolloClient();

  const topicQueryResult = useQuery(getTopicByIdQuery, {
    variables: { id: topicId },
    onCompleted: (data) => {
      const topicName = data?.topic?.name;

      if (topicName) {
        updateTopicNameByIdQuery(apolloClient, topicId, topicName);
      }
    },
  });

  return topicQueryResult;
}
