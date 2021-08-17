import React from 'react';
import PropTypes from 'prop-types';
import BreadcrumbLayout from '@/components/BreadcrumbLayout/BreadcrumbLayout';
import LoadingErrorEmptyDataLayout from '@/components/LoadingErrorEmptyDataLayout/LoadingErrorEmptyDataLayout';
import useAuthenticationContext from '@/hooks/use-authentication-context';
import TopicResourceListing from '@/components/TopicResourceListing/TopicResourceListing';
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner';
import getTopicBySlug from '@/services/topics/graphql-topic-by-slug-service';
import { NextSeo } from 'next-seo';
import useTopicResourceSearch from '@/hooks/topics/use-topic-resource-search';
import PageHeaderButton from '@/components/PageHeaderButton/PageHeaderButton';

const TopicDetails = ({ topicId, topicName, topicSlug, topicCreator }) => {
  const { isLoggedIn } = useAuthenticationContext();

  const {
    data: topicResourcesData,
    error: topicResourcesError,
    isLoading: isLoadingTopicResources,
    search,
    currentSearch,
    processSearch,
  } = useTopicResourceSearch(topicId);

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
    <div data-testid="TopicsDetails">
      <BreadcrumbLayout breadcrumbs={breadcrumbs}>
        <NextSeo
          title={topicName}
          openGraph={{
            title: `${topicName} - Resource Rank`,
            description: `Find the best resources for learning ${topicName}.`,
          }}
        />

        <div className="text-4xl" data-testid="TopicTitle">
          {topicName}
        </div>

        <div className="mt-3 text-xs text-gray-800">
          Created by {topicCreator}
        </div>

        <div className="mt-10">
          <PageHeaderButton
            title={'Resources'}
            titleClassName="text-3xl"
            linkTo={`/topics/${topicSlug}/resources/add`}
            buttonContent={'Add'}
            hideButton={!isLoggedIn}
          />
        </div>

        <div className="mt-8">
          <input
            data-testid="SearchInput"
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
    </div>
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
