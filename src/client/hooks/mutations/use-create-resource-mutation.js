import createResourceMutation from '@/graphql/mutations/create-resource-mutation';
import useLazyGraphQLRequest from '../graphql/use-lazy-graphql-request';

export default function useCreateResourceMutation() {
  const { execute, ...others } = useLazyGraphQLRequest(createResourceMutation);

  const executeMutation = (name, link) => execute({ name, link });

  return {
    execute: executeMutation,
    ...others,
  };
}
