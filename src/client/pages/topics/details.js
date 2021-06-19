import React from 'react';
import PropTypes from 'prop-types';
import TopicResourceListing from '../../components/topic-resource-listing/topic-resource-listing';
import Link from 'next/link';
import useTopicName from '../../hooks/use-topic-name';
import { Spinner } from 'react-bootstrap';
import BreadcrumbLayout from '../../components/layouts/breadcrumb-layout';
import getTopicResourceListQuery from '../../gql-requests/get-topic-resource-list-query';
import useLiveSearch from '../../hooks/use-live-search';
import LoadingErrorEmptyDataLayout from '../../components/layouts/loading-error-empty-data-layout';
import useAuthenticationState from '../../hooks/authentication/use-authentication-state';

function TopicDetails({ topicId }) {
  const { isLoggedIn } = useAuthenticationState();

  const { topicName, loading: topicNameLoading } = useTopicName(topicId);

  const searchTopicResources = async (searchInput) => {
    const { data, error } = await apolloClient.query({
      query: getTopicResourceListQuery,
      variables: { topicId, resourceSearch: searchInput },
    });

    if (error) {
      throw error;
    }

    const topicResources = data?.topicResourceList?.topicResources;
    if (!topicResources) {
      throw new Error('Failed to load topic resources.');
    }

    return topicResources;
  };

  const {
    data: topicResourcesData,
    dataLoadError: topicResourcesLoadError,
    dataLoading: topicResourcesLoading,
    search,
    processSearch,
    currentSearch,
  } = useLiveSearch(searchTopicResources);

  const topicResources = topicResourcesData ?? [];
  const hasTopicResources = topicResources.length > 0;
  const orderedResources = topicResources.sort(
    (r1, r2) => r2.ratingList?.average - r1.ratingList?.average
  );

  const onSearchChange = (e) => {
    const searchInput = e.target.value;
    processSearch(searchInput);
  };

  const getNoDataDisplay = () => {
    if (currentSearch) {
      return `No topic resources matching '${currentSearch}' have been added.`;
    }

    return 'No topic resources have been added.';
  };

  const topicLink = `/topics/${topicId}`;
  const breadcrumbs = [
    {
      to: '/topics',
      title: 'Topics',
    },
    {
      to: topicLink,
      title: topicName ?? 'Topic Name',
    },
  ];

  return (
    <BreadcrumbLayout breadcrumbs={breadcrumbs}>
      <title>{topicName ?? 'Topic Details'} - Resource Rank</title>

      <div>
        <div className="page-header d-flex flex-wrap align-items-center">
          <div className="me-3">Topics:</div>
          {topicNameLoading && (
            <div className="fs-6">
              <Spinner animation="border" role="status" />
            </div>
          )}
          {!topicNameLoading && <div> {topicName ?? 'Topic Name'}</div>}
        </div>

        <div className="mt-4 row align-items-center justify-content-between">
          <div className="col-auto">
            <div className="font-md">Resources</div>
          </div>
          {isLoggedIn && (
            <div className="col-auto">
              <Link
                className="btn btn-primary font-sm"
                href={`/topics/${topicId}/resources/add`}
              >
                Add
              </Link>
            </div>
          )}
        </div>

        <input
          className="mt-4 form-control"
          placeholder="Search resources..."
          value={search}
          onChange={onSearchChange}
          type="text"
        />

        <div className="mt-4">
          <LoadingErrorEmptyDataLayout
            isLoading={topicResourcesLoading}
            hasError={!!topicResourcesLoadError}
            hasData={hasTopicResources}
            loadingDisplay={
              <div className="text-center fs-6">
                <Spinner animation="border" role="status" />
              </div>
            }
            errorDisplay="Failed to load topics resources."
            noDataDisplay={getNoDataDisplay()}
            dataDisplay={
              <TopicResourceListing
                topicId={topicId}
                topicResources={orderedResources}
              />
            }
          ></LoadingErrorEmptyDataLayout>
        </div>
      </div>
    </BreadcrumbLayout>
  );
}

TopicDetails.propTypes = {
  topicId: PropTypes.string,
};

export default TopicDetails;
