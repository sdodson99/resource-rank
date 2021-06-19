import readOnlyModeEnabledQuery from '../gql-requests/read-only-mode-enabled-query';
import useGraphQLRequest from './graphql/use-graphql-request';

export default function useReadOnlyModeStatus() {
  const { data } = useGraphQLRequest(readOnlyModeEnabledQuery);

  return data?.readOnlyModeEnabled;
}
