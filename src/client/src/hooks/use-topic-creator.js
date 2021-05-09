import { ApolloError, useMutation } from '@apollo/client';
import getErrorCode from '../errors/apollo-error-code-provider';
import TopicExistsError from '../errors/topic-exists-error';
import createTopicMutation from '../gql-requests/create-topic-mutation';

export default function useTopicCreator() {
  const [executeCreateTopicMutation] = useMutation(createTopicMutation);

  const createTopic = async (name) => {
    try {
      await executeCreateTopicMutation({ variables: { name } });
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

  return createTopic;
}
