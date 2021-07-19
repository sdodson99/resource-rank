import getUserRatingQuery from '../gql-requests/get-user-rating-query';
import useLazyGraphQLRequest from './graphql/use-lazy-graphql-request';

export default function useTopicResourceUserRatingQuery(topicId, resourceId) {
  const { execute, ...others } = useLazyGraphQLRequest(getUserRatingQuery);

  const executeQuery = () => execute({ topicId, resourceId });

  return {
    execute: executeQuery,
    ...others,
  };
}
