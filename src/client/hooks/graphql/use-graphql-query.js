import useSWR from 'swr';
import useGraphQLFetcherContext from '../graphql/use-graphql-fetcher';

export default function useGraphQLQuery(gqlDocument) {
  const graphQLFetch = useGraphQLFetcherContext();
  const { data, error } = useSWR(gqlDocument, graphQLFetch);

  const loading = !data && !error;

  return {
    data,
    error,
    loading,
  };
}
