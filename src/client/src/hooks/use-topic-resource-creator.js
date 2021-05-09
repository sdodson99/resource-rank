import { useMutation } from '@apollo/client';
import createTopicResourceMutation from '../gql-requests/create-topic-resource-mutation';

export default function useTopicResourceCreator() {
  const [
    executeCreateTopicResourceMutation,
    { loading: isCreatingTopicResource },
  ] = useMutation(createTopicResourceMutation);

  const createTopicResource = async (topicId, resourceId) => {
    const { data } = await executeCreateTopicResourceMutation({
      variables: {
        topicId,
        resourceId,
      },
    });

    const success = data?.createTopicResource;

    if (!success) {
      throw new Error('Failed to create topic resource.');
    }
  };

  return {
    isCreatingTopicResource,
    createTopicResource,
  };
}
