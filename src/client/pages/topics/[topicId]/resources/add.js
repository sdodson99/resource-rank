import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import BreadcrumbLayout from '../../../../components/BreadcrumbLayout/BreadcrumbLayout';
import { createGraphQLClient } from '../../../../graphql/clients/graphql-client-factory';
import getTopicNameByIdQuery from '../../../../graphql/queries/get-topic-name-by-id-query';
import PageHeaderButton from '../../../../components/PageHeaderButton/PageHeaderButton';
import LoadingErrorEmptyDataLayout from '../../../../components/LoadingErrorEmptyDataLayout/LoadingErrorEmptyDataLayout';
import LoadingSpinner from '../../../../components/LoadingSpinner/LoadingSpinner';
import useAvailableTopicResourcesQuery from '../../../../hooks/use-available-topic-resources-query';
import useDebounce from '../../../../hooks/use-debounce';
import AvailableResourceListing from '../../../../components/AvailableResourceListing/AvailableResourceListing';

const AddTopicResource = ({ topicId, name }) => {
  const [search, setSearch] = useState('');
  const [currentSearch, setCurrentSearch] = useState('');

  const {
    data: resourcesData,
    error: resourcesError,
    isLoading: isLoadingResources,
    execute: executeResourcesQuery,
  } = useAvailableTopicResourcesQuery();

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

  const onAddResource = async (resourceId) => {
    console.log(resourceId);
  };

  const resources = resourcesData?.availableResources;
  const hasResources = resources?.length > 0;

  const breadcrumbs = [
    {
      to: '/topics',
      title: 'Topics',
    },
    {
      to: `/topics/${topicId}`,
      title: name,
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
  name: PropTypes.string,
};

export async function getServerSideProps({ req, params: { topicId } }) {
  const client = createGraphQLClient();

  try {
    const topicResult = await client.fetch(getTopicNameByIdQuery, {
      id: topicId,
    });
    const name = topicResult?.topic?.name;

    if (!name) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        topicId,
        name,
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
}

export default AddTopicResource;
