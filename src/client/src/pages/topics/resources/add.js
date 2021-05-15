import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import HeaderButton from '../../../components/header-button/header-button';
import AddResourceListing from '../../../components/add-resource-listing/add-resource-listing';
import { navigate } from 'gatsby';
import useTopicName from '../../../hooks/use-topic-name';
import BreadcrumbLayout from '../../../components/layouts/breadcrumb-layout';
import useAvailableTopicResources from '../../../hooks/use-available-topic-resources';
import { Spinner } from 'react-bootstrap';
import useTopicResourceCreator from '../../../hooks/use-topic-resource-creator';
import LoadingErrorEmptyDataLayout from '../../../components/layouts/loading-error-empty-data-layout';

function AddTopicResource({ topicId }) {
  const [topicResources, setTopicResources] = useState([]);

  const {
    availableTopicResources,
    isLoading: isAvailableTopicResourcesLoading,
    error: availableTopicResourcesError,
    processSearchInput,
    currentSearch,
    search,
  } = useAvailableTopicResources(topicId);

  useEffect(() => setTopicResources(availableTopicResources), [
    availableTopicResources,
  ]);

  const onSearchInput = (e) => {
    const searchInput = e.target.value;
    processSearchInput(searchInput);
  };

  const {
    createTopicResource,
    isCreatingTopicResource,
  } = useTopicResourceCreator();

  const setTopicResourceAddError = (resourceId, error) => {
    const nextResources = [...topicResources];

    const updatedResourceIndex = nextResources.findIndex(
      (r) => r.id === resourceId
    );
    const updatedResource = {
      ...nextResources[updatedResourceIndex],
      addError: error,
    };
    nextResources[updatedResourceIndex] = updatedResource;

    setTopicResources(nextResources);
  };

  const clearTopicResourceAddError = (resourceId) =>
    setTopicResourceAddError(resourceId, null);

  const onAddResource = async (resourceId) => {
    try {
      await createTopicResource(topicId, resourceId);

      navigate(`/topics/${topicId}`);

      clearTopicResourceAddError(resourceId);
    } catch (error) {
      setTopicResourceAddError(resourceId, error);
    }
  };

  const isLoading = isCreatingTopicResource || isAvailableTopicResourcesLoading;
  const hasTopicResources = topicResources?.length > 0;

  const { topicName } = useTopicName(topicId);

  const breadcrumbs = [
    {
      to: '/',
      title: 'Topics',
    },
    {
      to: `/topics/${topicId}`,
      title: topicName ?? 'Topic Details',
    },
    {
      to: `/topics/${topicId}/resources/add`,
      title: 'Add',
    },
  ];

  return (
    <BreadcrumbLayout breadcrumbs={breadcrumbs}>
      <title>Add Topic Resource - Resource Rank</title>

      <HeaderButton
        title="Add Resource"
        buttonContent="New"
        linkTo={`/topics/${topicId}/resources/new`}
      />

      <div className="mt-4">
        <input
          type="text"
          className="form-control"
          placeholder="Search resources..."
          value={search}
          onInput={onSearchInput}
        />
      </div>

      <div className="mt-4">
        <LoadingErrorEmptyDataLayout
          isLoading={isLoading}
          hasError={!!availableTopicResourcesError}
          hasData={hasTopicResources}
          loadingDisplay={
            <div className="text-center">
              <Spinner animation="border" role="status" />
            </div>
          }
          errorDisplay={
            <div className="text-center text-sm-start">
              Failed to load available topic resources.
            </div>
          }
          noDataDisplay={
            <div className="text-center text-sm-start">
              {!currentSearch && 'No topic resources are available.'}
              {currentSearch &&
                `No topic resources matching '${currentSearch}' are available.`}
            </div>
          }
          dataDisplay={
            <AddResourceListing
              availableResources={topicResources}
              onAddResource={onAddResource}
            />
          }
        />
      </div>
    </BreadcrumbLayout>
  );
}

AddTopicResource.propTypes = {
  topicId: PropTypes.string,
};

export default AddTopicResource;
