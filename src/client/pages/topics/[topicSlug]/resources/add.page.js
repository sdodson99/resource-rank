import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import BreadcrumbLayout from '@/components/BreadcrumbLayout/BreadcrumbLayout';
import PageHeaderButton from '@/components/PageHeaderButton/PageHeaderButton';
import LoadingErrorEmptyDataLayout from '@/components/LoadingErrorEmptyDataLayout/LoadingErrorEmptyDataLayout';
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner';
import AvailableResourceListing from '@/components/AvailableResourceListing/AvailableResourceListing';
import { useRouter } from 'next/router';
import getTopicBySlug from '@/services/topics/graphql-topic-by-slug-service';
import { NextSeo } from 'next-seo';
import useAvailableTopicResourceSearch from '@/hooks/topics/use-available-topic-resource-search';
import useTopicResourceCreator from '@/hooks/topics/use-topic-resource-creator';

const AddTopicResource = ({ topicId, topicName, topicSlug }) => {
  const router = useRouter();

  const [resources, setResources] = useState([]);
  const {
    data: resourcesData,
    error: resourcesError,
    isLoading: isLoadingResources,
    search,
    currentSearch,
    processSearch,
  } = useAvailableTopicResourceSearch(topicId);

  useEffect(() => {
    const availableResources = resourcesData?.availableResources?.items
      ?.map((r) => ({
        ...r.resource,
        alreadyAdded: r.alreadyAdded,
      }))
      .filter((r) => r.slug);

    setResources(availableResources);
  }, [resourcesData]);

  const onSearchChange = (e) => {
    const searchInput = e.target.value;
    processSearch(searchInput);
  };

  const { createTopicResource } = useTopicResourceCreator();

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

    const success = await createTopicResource(topicId, resourceId);

    if (!success) {
      return setAddResourceError(resourceId, true);
    }

    router.push(`/topics/${topicSlug}/resources/${resourceSlug}?new=true`);
  };

  const getSearchDisplay = () => {
    if (!currentSearch) {
      return 'No resources have been created.';
    }

    return `No resources matching '${currentSearch}' have been created.`;
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
    <div data-testid="AddTopicResourcePage">
      <BreadcrumbLayout breadcrumbs={breadcrumbs}>
        <NextSeo
          title="Add Topic Resource"
          openGraph={{
            title: 'Add Topic Resource - Resource Rank',
            description: `Add a new topic resource to ${topicName}.`,
          }}
        />

        <PageHeaderButton
          title="Add Resource"
          buttonContent="New"
          linkTo={`/topics/${topicSlug}/resources/new`}
        />

        <div className="mt-8 flex flex-col">
          <input
            data-testid="SearchInput"
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
                {getSearchDisplay()}
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
    </div>
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
