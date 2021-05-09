import { useMutation } from '@apollo/client';
import createTopicResourceMutation from '../gql-requests/create-topic-resource-mutation';

export default function useTopicResourceCreator() {
  const [
    executeCreateTopicResourceMutation,
    { loading: isCreatingTopicResource },
  ] = useMutation(createTopicResourceMutation);

  const createTopicResource = async (topicId, resourceId) => {
    await executeCreateTopicResourceMutation({
      variables: {
        topicId,
        resourceId,
      },
    });
  };

  return {
    isCreatingTopicResource,
    createTopicResource,
  };
}
