import createTopicResourceMutation from '@/graphql/mutations/create-topic-resource-mutation';
import useLazyGraphQLRequest from '../graphql/use-lazy-graphql-request';

export default function useCreateTopicResourceMutation() {
  const { execute, ...others } = useLazyGraphQLRequest(
    createTopicResourceMutation
  );

  const executeMutation = (topicId, resourceId) =>
    execute({ topicId, resourceId });

  return {
    execute: executeMutation,
    ...others,
  };
}
