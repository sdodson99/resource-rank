import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import BreadcrumbLayout from '@/components/BreadcrumbLayout/BreadcrumbLayout';
import Head from 'next/head';
import Link from 'next/link';
import LoadingErrorEmptyDataLayout from '@/components/LoadingErrorEmptyDataLayout/LoadingErrorEmptyDataLayout';
import useAuthenticationContext from '@/hooks/use-authentication-context';
import useTopicResourceSearchQuery from '@/hooks/queries/use-topic-resource-search-query';
import useDebounce from '@/hooks/use-debounce';
import TopicResourceListing from '@/components/TopicResourceListing/TopicResourceListing';
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner';
import getTopicBySlug from '@/services/topics/graphql-topic-by-slug-service';

const TopicDetails = ({ topicId, topicName, topicSlug, topicCreator }) => {
  const { isLoggedIn } = useAuthenticationContext();

  const [search, setSearch] = useState('');
  const [currentSearch, setCurrentSearch] = useState('');

  const {
    data: topicResourcesData,
    error: topicResourcesError,
    isLoading: isLoadingTopicResources,
    execute: executeTopicResourceSearchQuery,
  } = useTopicResourceSearchQuery(topicId);

  const executeTopicResourceSearch = (search) => {
    setCurrentSearch(search);
    executeTopicResourceSearchQuery(search);
  };

  useEffect(() => {
    executeTopicResourceSearch(search);
  }, []);

  const debounceExecuteTopicResourceSearch = useDebounce(
    executeTopicResourceSearch,
    1000
  );

  const onSearchChange = (e) => {
    const searchInput = e.target.value;
    setSearch(searchInput);

    debounceExecuteTopicResourceSearch(searchInput);
  };

  const getNoDataDisplay = () => {
    if (currentSearch) {
      return `No topic resources matching '${currentSearch}' have been added.`;
    }

    return 'No topic resources have been added.';
  };

  const topicResources =
    topicResourcesData?.topicResourceList?.topicResources?.filter(
      (r) => r.resource?.slug
    ) ?? [];
  const hasTopicResources = topicResources.length > 0;
  const orderedResources = topicResources.sort(
    (r1, r2) => r2.ratingList?.average - r1.ratingList?.average
  );

  const topicLink = `/topics/${topicSlug}`;
  const breadcrumbs = [
    {
      to: '/topics',
      title: 'Topics',
    },
    {
      to: topicLink,
      title: topicName,
    },
  ];

  return (
    <BreadcrumbLayout breadcrumbs={breadcrumbs}>
      <Head>
        <title>{topicName} - Resource Rank</title>
      </Head>

      <div className="text-4xl">{topicName}</div>

      <div className="mt-3 text-xs text-gray-800">Created by {topicCreator}</div>

      <div className="mt-10 flex justify-between">
        <div className="text-3xl">Resources</div>

        {isLoggedIn && (
          <div className="flex ml-4">
            <Link href={`/topics/${topicSlug}/resources/add`}>
              <a className="btn btn-primary">Add</a>
            </Link>
          </div>
        )}
      </div>

      <div className="mt-8">
        <input
          className="w-full form-control-lg"
          placeholder="Search resources..."
          type="text"
          onChange={onSearchChange}
          value={search}
        />

        <div className="mt-8">
          <LoadingErrorEmptyDataLayout
            isLoading={isLoadingTopicResources}
            loadingDisplay={
              <div className="text-center">
                <LoadingSpinner />
              </div>
            }
            hasError={!!topicResourcesError}
            errorDisplay={
              <div className="text-center sm:text-left error-text">
                Failed to load topic resources.
              </div>
            }
            hasData={hasTopicResources}
            noDataDisplay={
              <div className="text-center sm:text-left">
                {getNoDataDisplay()}
              </div>
            }
            dataDisplay={
              <TopicResourceListing
                topicId={topicId}
                topicSlug={topicSlug}
                topicResources={orderedResources}
              />
            }
          />
        </div>
      </div>
    </BreadcrumbLayout>
  );
};

TopicDetails.propTypes = {
  topicId: PropTypes.string,
  topicName: PropTypes.string,
  topicSlug: PropTypes.string,
  topicCreator: PropTypes.string,
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
        topicCreator: topic.createdBy?.username ?? 'Unknown',
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
}

export default TopicDetails;
