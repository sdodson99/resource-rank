import createTopicMutation from '@/graphql/mutations/create-topic-mutation';
import useLazyGraphQLRequest from './graphql/use-lazy-graphql-request';

export default function useCreateTopicMutation() {
  const { execute, ...others } = useLazyGraphQLRequest(createTopicMutation);

  const executeMutation = (name) => execute({ name });

  return {
    execute: executeMutation,
    ...others,
  };
}
