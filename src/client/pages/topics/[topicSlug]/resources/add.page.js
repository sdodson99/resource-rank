import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import BreadcrumbLayout from '@/components/BreadcrumbLayout/BreadcrumbLayout';
import PageHeaderButton from '@/components/PageHeaderButton/PageHeaderButton';
import LoadingErrorEmptyDataLayout from '@/components/LoadingErrorEmptyDataLayout/LoadingErrorEmptyDataLayout';
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner';
import useAvailableTopicResourcesQuery from '@/hooks/use-available-topic-resources-query';
import useDebounce from '@/hooks/use-debounce';
import AvailableResourceListing from '@/components/AvailableResourceListing/AvailableResourceListing';
import useCreateTopicResourceMutation from '@/hooks/use-create-topic-resource-mutation';
import { useRouter } from 'next/router';
import getTopicBySlug from '@/services/topics/graphql-topic-by-slug-service';

const AddTopicResource = ({ topicId, topicName, topicSlug }) => {
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
    const availableResources = resourcesData?.availableResources?.filter(
      (r) => r.slug
    );

    setResources(availableResources);
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

  const onAddResource = async ({ id: resourceId, slug: resourceSlug }) => {
    setAddResourceError(resourceId, false);

    const { data, error } = await executeCreateTopicResourceMutation(
      topicId,
      resourceId
    );

    if (error) {
      return setAddResourceError(resourceId, true);
    }

    const success = data?.createTopicResource;

    if (!success) {
      return setAddResourceError(resourceId, true);
    }

    router.push(`/topics/${topicSlug}/resources/${resourceSlug}`);
  };

  const hasResources = resources?.length > 0;

  const breadcrumbs = [
    {
      to: '/topics',
      title: 'Topics',
    },
    {
      to: `/topics/${topicSlug}`,
      title: topicName,
    },
    {
      to: `/topics/${topicSlug}/resources/add`,
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
        linkTo={`/topics/${topicSlug}/resources/new`}
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
  topicSlug: PropTypes.string,
};

export async function getServerSideProps({ req, params: { topicSlug } }) {
  try {
    const topic = await getTopicBySlug(topicSlug);

    if (!topic) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        topicId: topic.id,
        topicName: topic.name,
        topicSlug: topic.slug,
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
}

export default AddTopicResource;
