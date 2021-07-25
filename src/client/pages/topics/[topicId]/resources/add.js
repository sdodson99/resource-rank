import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import BreadcrumbLayout from '../../../../components/BreadcrumbLayout/BreadcrumbLayout';
import PageHeaderButton from '../../../../components/PageHeaderButton/PageHeaderButton';
import LoadingErrorEmptyDataLayout from '../../../../components/LoadingErrorEmptyDataLayout/LoadingErrorEmptyDataLayout';
import LoadingSpinner from '../../../../components/LoadingSpinner/LoadingSpinner';
import useAvailableTopicResourcesQuery from '../../../../hooks/use-available-topic-resources-query';
import useDebounce from '../../../../hooks/use-debounce';
import AvailableResourceListing from '../../../../components/AvailableResourceListing/AvailableResourceListing';
import useCreateTopicResourceMutation from '../../../../hooks/use-create-topic-resource-mutation';
import { useRouter } from 'next/router';
import getTopicName from '../../../../services/topic-names/graphql-topic-name-service';

const AddTopicResource = ({ topicId, topicName }) => {
  const router = useRouter();

  const [resources, setResources] = useState([]);
  const [search, setSearch] = useState('');
  const [currentSearch, setCurrentSearch] = useState('');

  const {
    data: resourcesData,
    error: resourcesError,
    isLoading: isLoadingResources,
    execute: executeResourcesQuery,
  } = useAvailableTopicResourcesQuery();

  useEffect(() => {
    setResources(resourcesData?.availableResources);
  }, [resourcesData]);

  const executeResourcesSearch = async (search) => {
    setCurrentSearch(search);
    executeResourcesQuery({ topicId, search });
  };

  useEffect(() => {
    executeResourcesSearch(search);
  }, []);

  const debounceExecuteResourcesSearch = useDebounce(
    executeResourcesSearch,
    1000
  );

  const onSearchChange = (e) => {
    const searchInput = e.target.value;
    setSearch(searchInput);

    debounceExecuteResourcesSearch(searchInput);
  };

  const { execute: executeCreateTopicResourceMutation } =
    useCreateTopicResourceMutation();

  // TBD: Move this logic into resource listing/listing item components?
  const setAddResourceError = (resourceId, status) => {
    const nextResources = [...resources];

    const updatedResourceIndex = nextResources.findIndex(
      (r) => r.id === resourceId
    );
    const updatedResource = {
      ...nextResources[updatedResourceIndex],
      hasAddError: status,
    };
    nextResources[updatedResourceIndex] = updatedResource;

    setResources(nextResources);
  };

  const onAddResource = async (resourceId) => {
    setAddResourceError(resourceId, false);

    try {
      await executeCreateTopicResourceMutation(topicId, resourceId);

      router.push(`/topics/${topicId}/resources/${resourceId}`);
    } catch (error) {
      setAddResourceError(resourceId, true);
    }
  };

  const hasResources = resources?.length > 0;

  const breadcrumbs = [
    {
      to: '/topics',
      title: 'Topics',
    },
    {
      to: `/topics/${topicId}`,
      title: topicName,
    },
    {
      to: `/topics/${topicId}/resources/add`,
      title: 'Add',
    },
  ];

  return (
    <BreadcrumbLayout breadcrumbs={breadcrumbs}>
      <Head>
        <title>Add Topic Resource - Resource Rank</title>
      </Head>

      <PageHeaderButton
        title="Add Resource"
        buttonContent="New"
        linkTo={`/topics/${topicId}/resources/new`}
      />

      <div className="mt-8 flex flex-col">
        <input
          className="flex-grow form-control-lg"
          placeholder="Search resources..."
          value={search}
          onChange={onSearchChange}
          type="text"
        />
      </div>

      <div className="mt-8">
        <LoadingErrorEmptyDataLayout
          isLoading={isLoadingResources}
          loadingDisplay={
            <div className="text-center">
              <LoadingSpinner />
            </div>
          }
          hasError={!!resourcesError}
          errorDisplay={
            <div className="text-center sm:text-left error-text">
              Failed to load available resources.
            </div>
          }
          hasData={hasResources}
          noDataDisplay={
            <div className="text-center sm:text-left">
              {!currentSearch && 'No resources have been created.'}
              {currentSearch &&
                `No resources matching '${currentSearch}' have been created.`}
            </div>
          }
          dataDisplay={
            <AvailableResourceListing
              resources={resources}
              onAddResource={onAddResource}
            />
          }
        />
      </div>
    </BreadcrumbLayout>
  );
};

AddTopicResource.propTypes = {
  topicId: PropTypes.string,
  topicName: PropTypes.string,
};

export async function getServerSideProps({ req, params: { topicId } }) {
  try {
    const topicName = await getTopicName(topicId);

    return {
      props: {
        topicId,
        topicName,
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
}

export default AddTopicResource;
