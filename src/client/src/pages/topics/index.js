import React, { useEffect, useRef, useState } from 'react';
import TopicListing from '../../components/topic-listing/topic-listing';
import getTopicsQuery from '../../gql-requests/get-topics-query';
import HeaderButton from '../../components/header-button/header-button';
import { Spinner } from 'react-bootstrap';
import BreadcrumbLayout from '../../components/layouts/breadcrumb-layout';
import { useApolloClient } from '@apollo/client';
import { merge, of, Subject } from 'rxjs';
import { catchError, debounceTime, map, switchMap } from 'rxjs/operators';

export default function Index() {
  const [topics, setTopics] = useState([]);
  const [topicsLoading, setTopicsLoading] = useState(false);
  const [topicsLoadError, setTopicsLoadError] = useState();
  const [currentSearch, setCurrentSearch] = useState('');
  const [search, setSearch] = useState('');
  const topicSearchSubject = useRef(new Subject()).current;

  const apolloClient = useApolloClient();

  const loadTopics = async (searchInput) => {
    const { data, error } = await apolloClient.query({
      query: getTopicsQuery,
      variables: {
        name: searchInput,
      },
    });

    if (error) {
      throw error;
    }

    const topics = data?.topics;
    if (!topics) {
      throw new Error('Failed to load topics.');
    }

    return topics;
  };

  useEffect(() => {
    const subscription = topicSearchSubject
      .pipe(
        debounceTime(1000),
        switchMap((searchInput) =>
          merge(
            of({ loading: true, input: searchInput }),
            of(searchInput).pipe(
              switchMap(loadTopics),
              map((data) => ({ data, input: searchInput })),
              catchError((error) => of({ error }))
            )
          )
        )
      )
      .subscribe(({ data, loading, error, input }) => {
        setTopicsLoadError(null);
        setTopicsLoading(false);

        if (loading) {
          return setTopicsLoading(true);
        }

        if (error) {
          return setTopicsLoadError(error);
        }

        setTopics(data);
        setCurrentSearch(input);
      });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(async () => {
    setTopicsLoading(true);
    setTopicsLoadError(null);

    try {
      const topics = await loadTopics(search);
      setTopics(topics);
    } catch (error) {
      setTopicsLoadError(error);
    }

    setTopicsLoading(false);
  }, []);

  const onSearchChange = (e) => {
    const searchInput = e.target.value;

    setSearch(searchInput);
    topicSearchSubject.next(searchInput);
  };

  const hasTopics = topics?.length > 0;
  const topicsError = !topics || topicsLoadError;

  const breadcrumbs = [
    {
      to: '/',
      title: 'Topics',
    },
  ];

  return (
    <BreadcrumbLayout breadcrumbs={breadcrumbs}>
      <HeaderButton title="Topics" linkTo="/topics/new" buttonContent="New" />

      <div className="mt-4">
        <input
          className="form-control"
          placeholder="Search topics..."
          value={search}
          onChange={onSearchChange}
          type="text"
        />

        <div className="mt-4">
          {topicsLoading && (
            <div className="text-center">
              <Spinner animation="border" role="status" />
            </div>
          )}

          {!topicsLoading && (
            <div>
              {topicsError && (
                <div className="text-center text-sm-start">
                  Failed to load topics.
                </div>
              )}

              {!topicsError && (
                <div>
                  {!hasTopics && (
                    <div className="text-center text-sm-start">
                      {!currentSearch && 'No topic have been created.'}
                      {currentSearch &&
                        `No topics matching '${currentSearch}' have been created.`}
                    </div>
                  )}

                  {hasTopics && <TopicListing topics={topics} />}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </BreadcrumbLayout>
  );
}
