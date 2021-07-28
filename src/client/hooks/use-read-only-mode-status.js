import readOnlyModeEnabledQuery from '@/graphql/queries/read-only-mode-enabled-query';
import useGraphQLQuery from './graphql/use-graphql-query';

export default function useReadOnlyModeStatus() {
  const { data } = useGraphQLQuery(readOnlyModeEnabledQuery);

  return data?.readOnlyModeEnabled;
}
