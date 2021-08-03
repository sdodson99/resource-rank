import readOnlyModeEnabledQuery from '@/graphql/queries/read-only-mode-enabled-query';
import useSWR from 'swr';
import useGraphQLFetcherContext from '../graphql/use-graphql-fetcher';

export default function useReadOnlyModeEnabledQuery() {
  const graphQLFetch = useGraphQLFetcherContext();
  const { data } = useSWR(readOnlyModeEnabledQuery, graphQLFetch);

  return data?.readOnlyModeEnabled ?? false;
}
