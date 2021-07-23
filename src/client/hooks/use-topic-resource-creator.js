import createTopicResourceMutation from '../graphql/mutations/create-topic-resource-mutation';

export default function useTopicResourceCreator() {
  const [
    executeCreateTopicResourceMutation,
    { loading: isCreatingTopicResource },
  ] = useMutation(createTopicResourceMutation);

  const createTopicResource = async (topicId, resourceId) => {
    const { data, error } = await executeCreateTopicResourceMutation({
      variables: {
        topicId,
        resourceId,
      },
    });

    if (error) {
      throw error;
    }

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
