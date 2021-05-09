import { useApolloClient } from '@apollo/client';
import { useEffect, useRef, useState } from 'react';
import { of, Subject, concat } from 'rxjs';
import { debounceTime, map, switchMap } from 'rxjs/operators';
import getAvailableResourcesQuery from '../gql-requests/get-available-resources-query';

export default function useAvailableTopicResources(topicId) {
  const [availableTopicResources, setAvailableTopicResources] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState();
  const [currentSearch, setCurrentSearch] = useState('');
  const searchInputSubject = useRef(new Subject()).current;

  const client = useApolloClient();
  const getAvailableTopicResources = async (searchInput) => {
    const response = await client.query({
      query: getAvailableResourcesQuery,
      variables: {
        topicId,
        search: searchInput,
        limit: 20,
      },
    });

    const availableResources = response?.data?.availableResources;

    if (!availableResources) {
      throw new Error('Failed to load available resources.');
    }

    return availableResources;
  };

  useEffect(() => {
    const subscription = searchInputSubject
      .pipe(
        debounceTime(1000),
        switchMap((searchInput) =>
          concat(
            of({ loading: true, input: searchInput }),
            of(searchInput).pipe(
              switchMap(getAvailableTopicResources),
              map((data) => ({ data, input: searchInput }))
            )
          )
        )
      )
      .subscribe(
        ({ data, loading, input }) => {
          if (loading) {
            return setIsLoading(true);
          }

          setError(null);
          setIsLoading(false);
          setCurrentSearch(input);
          setAvailableTopicResources(data);
        },
        (error) => {
          setError(error);
          setIsLoading(false);
        }
      );

    return () => subscription.unsubscribe();
  }, []);

  const initialize = async (searchInput) => {
    setIsLoading(true);

    try {
      const availableResources = await getAvailableTopicResources(searchInput);
      setAvailableTopicResources(availableResources);
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const processSearchInput = (searchInput) =>
    searchInputSubject.next(searchInput);

  return {
    initialize,
    currentSearch,
    processSearchInput,
    availableTopicResources,
    isLoading,
    error,
  };
}
