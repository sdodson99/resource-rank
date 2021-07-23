import getErrorCode from '../errors/apollo-error-code-provider';
import TopicExistsError from '../errors/topic-exists-error';
import createTopicMutation from '../gql-requests/create-topic-mutation';
import useLazyGraphQLRequest from './graphql/use-lazy-graphql-request';

export default function useCreateTopicMutation() {
  const { execute, ...others } = useLazyGraphQLRequest(createTopicMutation);

  const executeMutation = (name) => execute({ name });

  // if (error instanceof ApolloError) {
  //   const errorCode = getErrorCode(error);

  //   if (errorCode === 'TOPIC_ALREADY_EXISTS') {
  //     throw new TopicExistsError('Topic name already exists.');
  //   }
  // }

  return {
    execute: executeMutation,
    ...others,
  };
}
