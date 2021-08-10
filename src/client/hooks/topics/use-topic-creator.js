import TopicExistsError from '@/errors/topic-exists-error';
import ErrorCode from '@/graphql/errors/error-code';
import getErrorCode from '@/graphql/errors/get-error-code';
import useCreateTopicMutation from '../mutations/use-create-topic-mutation';

export default function useTopicCreator() {
  const { execute: executeMutation } = useCreateTopicMutation();

  const createTopic = async ({ name }) => {
    const { data, error } = await executeMutation({ name });

    if (error) {
      const errorCode = getErrorCode(error);

      if (errorCode === ErrorCode.TOPIC_ALREADY_EXISTS) {
        throw new TopicExistsError('Topic already exists.', name);
      }

      throw error;
    }

    const createdTopic = data?.createTopic;

    if (!createdTopic) {
      throw new Error('Failed to create topic.');
    }

    return createdTopic;
  };

  return {
    createTopic,
  };
}
