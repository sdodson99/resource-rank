import topicExistsQuery from '../gql-requests/topic-exists-query';
import useLazyGraphQLRequest from './graphql/use-lazy-graphql-request';

export default function useTopicExistsQuery() {
  const { execute, ...others } = useLazyGraphQLRequest(topicExistsQuery);

  const executeQuery = (name) => execute({ name });

  return {
    execute: executeQuery,
    ...others,
  };
}
