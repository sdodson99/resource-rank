import { useState } from 'react';
import useGraphQLFetcherContext from './use-graphql-fetcher';

export default function useLazyGraphQLRequest(gqlDocument) {
  const [data, setData] = useState();
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const gqlFetch = useGraphQLFetcherContext();

  const execute = async (variables) => {
    setIsLoading(true);
    setData(null);
    setError(null);

    try {
      const responseData = await gqlFetch(gqlDocument, variables);
      setData(responseData);

      return {
        data: responseData,
      };
    } catch (error) {
      setError(error);

      return {
        error,
      };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    execute,
    data,
    error,
    isLoading,
  };
}
