import { ApolloError, useMutation } from '@apollo/client';
import getErrorCode from '../errors/apollo-error-code-provider';
import TopicExistsError from '../errors/topic-exists-error';
import createTopicMutation from '../gql-requests/create-topic-mutation';

export default function useTopicCreator() {
  const [
    executeCreateTopicMutation,
    { loading: isCreatingTopic },
  ] = useMutation(createTopicMutation);

  const createTopic = async (name) => {
    try {
      const { data } = await executeCreateTopicMutation({
        variables: { name },
      });

      const success = data?.createTopic;

      if (!success) {
        throw new Error('Failed to create topic.');
      }
    } catch (error) {
      if (error instanceof ApolloError) {
        const errorCode = getErrorCode(error);

        if (errorCode === 'TOPIC_ALREADY_EXISTS') {
          throw new TopicExistsError('Topic name already exists.');
        }
      }

      throw error;
    }
  };

  return { createTopic, isCreatingTopic };
}
