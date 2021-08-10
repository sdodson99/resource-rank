import useCreateTopicResourceMutation from '../mutations/use-create-topic-resource-mutation';

export default function useTopicResourceCreator() {
  const { execute: executeMutation, isLoading: isCreating } =
    useCreateTopicResourceMutation();

  const createTopicResource = async (topicId, resourceId) => {
    const { data, error } = await executeMutation(topicId, resourceId);

    if (error) {
      return false;
    }

    const success = data?.createTopicResource;

    return success;
  };

  return {
    createTopicResource,
    isCreating,
  };
}
