import { useRef } from 'react';
import useSWR from 'swr';
import useGraphQLFetcherContext from './use-graphql-fetcher';

export default function useGraphQLRequest(document, variables = {}) {
  const graphQLFetcher = useGraphQLFetcherContext();
  const variablesRef = useRef(variables).current;

  return useSWR([document, variablesRef], graphQLFetcher);
}
