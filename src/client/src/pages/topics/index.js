import React from 'react';
import TopicListing from '../../components/topic-listing/topic-listing';
import getTopicsQuery from '../../gql-requests/get-topics-query';
import HeaderButton from '../../components/header-button/header-button';
import { Spinner } from 'react-bootstrap';
import BreadcrumbLayout from '../../components/layouts/breadcrumb-layout';
import { useApolloClient } from '@apollo/client';
import useLiveSearch from '../../hooks/use-live-search';
import LoadingErrorEmptyDataLayout from '../../components/layouts/loading-error-empty-data-layout';

export default function Index() {
  const apolloClient = useApolloClient();
  const loadTopics = async (searchInput) => {
    const { data, error } = await apolloClient.query({
      query: getTopicsQuery,
      variables: {
        search: searchInput,
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

  const {
    data: topics,
    processSearch,
    currentSearch,
    dataLoadError: topicsLoadError,
    dataLoading: topicsLoading,
    search,
  } = useLiveSearch(loadTopics);

  const onSearchChange = (e) => {
    const searchInput = e.target.value;
    processSearch(searchInput);
  };

  const hasTopics = topics?.length > 0;

  const breadcrumbs = [
    {
      to: '/',
      title: 'Topics',
    },
  ];

  return (
    <BreadcrumbLayout breadcrumbs={breadcrumbs}>
      <title>Topics - Resource Rank</title>

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
          <LoadingErrorEmptyDataLayout
            isLoading={topicsLoading}
            hasError={!!topicsLoadError}
            hasData={hasTopics}
            loadingDisplay={
              <div className="text-center">
                <Spinner animation="border" role="status" />
              </div>
            }
            errorDisplay={
              <div className="text-center text-sm-start">
                Failed to load topics.
              </div>
            }
            noDataDisplay={
              <div className="text-center text-sm-start">
                {!currentSearch && 'No topics have been created.'}
                {currentSearch &&
                  `No topics matching '${currentSearch}' have been created.`}
              </div>
            }
            dataDisplay={<TopicListing topics={topics} />}
          />
        </div>
      </div>
    </BreadcrumbLayout>
  );
}
