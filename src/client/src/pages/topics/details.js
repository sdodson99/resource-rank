import React from 'react';
import PropTypes from 'prop-types';
import TopicResourceListing from '../../components/topic-resource-listing/topic-resource-listing';
import { Link } from 'gatsby';
import useTopicName from '../../hooks/use-topic-name';
import { Spinner } from 'react-bootstrap';
import BreadcrumbLayout from '../../components/layouts/breadcrumb-layout';
import getTopicResourceListQuery from '../../gql-requests/get-topic-resource-list-query';
import useLiveSearch from '../../hooks/use-live-search';
import { useApolloClient } from '@apollo/client';
import LoadingErrorEmptyDataLayout from '../../components/layouts/loading-error-empty-data-layout';

function TopicDetails({ topicId }) {
  const { topicName, loading: topicNameLoading } = useTopicName(topicId);

  const apolloClient = useApolloClient();
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
  const hasTopicResourceError = !topicResourcesData || topicResourcesLoadError;
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

  const breadcrumbs = [
    {
      to: '/',
      title: 'Topics',
    },
    {
      to: `/topics/${topicId}`,
      title: topicName ?? 'Topic Name',
    },
  ];

  return (
    <BreadcrumbLayout breadcrumbs={breadcrumbs}>
      <div>
        <div className="text-center text-sm-start">
          <div className="page-header row align-items-center text-center text-sm-start">
            <div className="col-sm-auto">Topic:</div>
            <div className="col-sm-auto">
              {topicNameLoading && (
                <div className="ms-3 fs-6">
                  <Spinner animation="border" role="status" />
                </div>
              )}
              {!topicNameLoading && <div>{topicName ?? 'Topic Name'}</div>}
            </div>
          </div>

          <div className="mt-4 row align-items-center justify-content-between">
            <div className="col-sm-auto">
              <div className="font-md">Resources</div>
            </div>
            <div className="col-sm-auto mt-2 mt-sm-0">
              <Link
                className="btn btn-primary font-sm"
                to={`/topics/${topicId}/resources/add`}
              >
                Add
              </Link>
            </div>
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
              hasError={!!hasTopicResourceError}
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
      </div>
    </BreadcrumbLayout>
  );
}

TopicDetails.propTypes = {
  topicId: PropTypes.string,
};

export default TopicDetails;
