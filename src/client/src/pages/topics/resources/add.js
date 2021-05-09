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

function AddTopicResource({ topicId }) {
  const [search, setSearch] = useState('');

  const {
    initialize,
    processSearchInput,
    availableTopicResources,
    isLoading: isAvailableTopicResourcesLoading,
  } = useAvailableTopicResources(topicId);

  useEffect(async () => await initialize(search), []);

  const onSearchInput = (e) => {
    const searchInput = e.target.value;

    setSearch(searchInput);
    processSearchInput(searchInput);
  };

  const {
    createTopicResource,
    isCreatingTopicResource,
  } = useTopicResourceCreator();

  const onAddResource = async (resourceId) => {
    await createTopicResource(topicId, resourceId);

    navigate(`/topics/${topicId}`);
  };

  const isLoading = isCreatingTopicResource || isAvailableTopicResourcesLoading;

  const topicName = useTopicName(topicId);

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
      <HeaderButton
        title="Add Resource"
        buttonContent="New"
        linkTo={`/topics/${topicId}/resources/new`}
      />

      <div className="mt-4">
        <input
          type="text"
          className="form-control"
          placeholder="Search..."
          value={search}
          onInput={onSearchInput}
        />
      </div>

      <div className="mt-4">
        {isLoading && (
          <div className="text-center">
            <Spinner animation="border" role="status" />
          </div>
        )}

        {!isLoading && (
          <AddResourceListing
            availableResources={availableTopicResources}
            onAddResource={onAddResource}
          />
        )}
      </div>
    </BreadcrumbLayout>
  );
}

AddTopicResource.propTypes = {
  topicId: PropTypes.string,
};

export default AddTopicResource;
