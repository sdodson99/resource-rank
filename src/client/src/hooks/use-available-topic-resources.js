import { useApolloClient } from '@apollo/client';
import { useEffect, useRef, useState } from 'react';
import { from, of, Subject, concat } from 'rxjs';
import { debounceTime, map, switchMap } from 'rxjs/operators';
import getAvailableResourcesQuery from '../gql-requests/get-available-resources-query';

export default function useAvailableTopicResources(topicId) {
  const [availableTopicResources, setAvailableTopicResources] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
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

    return response?.data?.availableResources ?? [];
  };

  useEffect(() => {
    const subscription = searchInputSubject
      .pipe(
        debounceTime(1000),
        switchMap((searchInput) =>
          concat(
            of({ loading: true }),
            from(getAvailableTopicResources(searchInput)).pipe(
              map((data) => ({ data }))
            )
          )
        )
      )
      .subscribe(({ data, loading }) => {
        if (loading) {
          return setIsLoading(true);
        }

        setIsLoading(false);
        setAvailableTopicResources(data);
      });

    return () => subscription.unsubscribe();
  }, []);

  const initialize = async (searchInput) => {
    setIsLoading(true);

    try {
      const availableResources = await getAvailableTopicResources(searchInput);
      setAvailableTopicResources(availableResources);
    } finally {
      setIsLoading(false);
    }
  };

  const processSearchInput = (searchInput) =>
    searchInputSubject.next(searchInput);

  return {
    initialize,
    processSearchInput,
    availableTopicResources,
    isLoading,
  };
}
