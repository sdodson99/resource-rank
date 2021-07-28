import getUserRatingQuery from '@/graphql/queries/user-rating-query';
import useLazyGraphQLRequest from './graphql/use-lazy-graphql-request';

export default function useTopicResourceUserRatingQuery(topicId, resourceId) {
  const { execute, ...others } = useLazyGraphQLRequest(getUserRatingQuery);

  const executeQuery = () => execute({ topicId, resourceId });

  return {
    execute: executeQuery,
    ...others,
  };
}
