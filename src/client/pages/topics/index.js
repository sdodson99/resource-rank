import React, { useCallback, useEffect, useState } from 'react';
import TopicListing from '../../components/topic-listing/topic-listing';
import BreadcrumbLayout from '../../components/BreadcrumbLayout/BreadcrumbLayout';
import LoadingErrorEmptyDataLayout from '../../components/LoadingErrorEmptyDataLayout/LoadingErrorEmptyDataLayout';
import useAuthenticationState from '../../hooks/authentication/use-authentication-context';
import PageHeaderButton from '../../components/PageHeaderButton/PageHeaderButton';
import { useRouter } from 'next/router';
import Head from 'next/head';
import useTopicSearchQuery from '../../hooks/use-topic-search-query';
import debounce from 'lodash.debounce';

export default function Topics() {
  const router = useRouter();
  const { q: searchQuery } = router.query;
  const { isLoggedIn } = useAuthenticationState();
  const executeTopicSearchQuery = useTopicSearchQuery();

  const [topics, setTopics] = useState([]);
  const [search, setSearch] = useState(searchQuery || '');
  const [currentSearch, setCurrentSearch] = useState('');
  const [isLoadingTopics, setIsLoadingTopics] = useState(true);
  const [loadTopicsError, setLoadTopicsError] = useState();

  const loadTopics = async (searchInput) => {
    setIsLoadingTopics(true);
    setTopics([]);
    setLoadTopicsError(null);

    setCurrentSearch(searchInput);

    try {
      const { topics } = await executeTopicSearchQuery(searchInput);
      setTopics(topics);
    } catch (error) {
      setLoadTopicsError(error);
    } finally {
      setIsLoadingTopics(false);
    }
  };

  useEffect(() => {
    loadTopics(search);
  }, []);

  const debounceLoadTopics = useCallback(
    debounce((searchInput) => loadTopics(searchInput), 1000),
    []
  );
  const onSearchChange = (e) => {
    const searchInput = e.target.value;
    setSearch(searchInput);

    debounceLoadTopics(searchInput);
  };

  const hasTopics = topics?.length > 0;
  const breadcrumbs = [
    {
      to: '/topics',
      title: 'Topics',
    },
  ];

  return (
    <BreadcrumbLayout breadcrumbs={breadcrumbs}>
      <Head>
        <title>Topics - Resource Rank</title>
      </Head>

      <PageHeaderButton
        title="Topics"
        linkTo="/topics/new"
        buttonContent="New"
        hideButton={!isLoggedIn}
      />

      <div className="mt-8 flex flex-col">
        <input
          className="flex-grow"
          placeholder="Search topics..."
          value={search}
          onChange={onSearchChange}
          type="text"
        />

        <div className="mt-8">
          <LoadingErrorEmptyDataLayout
            isLoading={isLoadingTopics}
            loadingDisplay={<div className="text-center">Loading</div>}
            hasError={!!loadTopicsError}
            errorDisplay={
              <div className="text-center sm:text-left">
                Failed to load topics.
              </div>
            }
            hasData={hasTopics}
            noDataDisplay={
              <div className="text-center sm:text-left">
                {!currentSearch && 'No topics have been created.'}
                {currentSearch &&
                  `No topics matching '${currentSearch}' have been created.`}
              </div>
            }
            dataDisplay={topics.length}
          />
        </div>
      </div>
    </BreadcrumbLayout>
  );
}
