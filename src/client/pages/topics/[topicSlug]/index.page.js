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
import VerifiedIcon from '@/components/VerifiedIcon/VerifiedIcon';
import InfoAlert from '@/components/Alerts/InfoAlert/InfoAlert';
import Pagination from '@/components/Pagination/Pagination';

const DEFAULT_SEARCH_LIMIT = 10;

const TopicDetails = ({
  topicId,
  topicName,
  topicSlug,
  topicCreator,
  topicVerified,
  isNew,
}) => {
  const { isLoggedIn } = useAuthenticationContext();

  const {
    data: topicResourcesData,
    error: topicResourcesError,
    isLoading: isLoadingTopicResources,
    searchVariables: { resourceSearch: search },
    currentSearchVariables: { resourceSearch: currentSearch, limit },
    debounceProcessSearch,
    currentPage,
    processPageNumber,
  } = useTopicResourceSearch(topicId, {
    initialSearchVariables: {
      resourceSearch: '',
      offset: 0,
      limit: DEFAULT_SEARCH_LIMIT,
    },
  });

  const onSearchChange = (e) => {
    const searchInput = e.target.value;
    debounceProcessSearch({
      resourceSearch: searchInput,
      offset: 0,
      limit: DEFAULT_SEARCH_LIMIT,
    });
  };

  const getNoDataDisplay = () => {
    if (currentSearch) {
      return `No topic resources matching '${currentSearch}' have been added.`;
    }

    return 'No topic resources have been added.';
  };

  const topicResources = topicResourcesData?.topicResources?.items ?? [];
  const totalTopicResourcesCount =
    topicResourcesData?.topicResources?.totalCount;
  const topicResourcesPageCount = Math.ceil(totalTopicResourcesCount / limit);
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

        {isNew && (
          <div className="mb-8">
            <InfoAlert border>Successfully created topic.</InfoAlert>
          </div>
        )}

        <div className="flex items-center">
          <div className="text-4xl" data-testid="TopicTitle">
            {topicName}
          </div>

          {topicVerified && (
            <div className="ml-2">
              <VerifiedIcon size={25} />
            </div>
          )}
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
                <div>
                  <TopicResourceListing
                    topicId={topicId}
                    topicSlug={topicSlug}
                    topicResources={orderedResources}
                  />

                  <div className="mt-8 flex justify-center">
                    <Pagination
                      selectedPage={currentPage}
                      pageCount={topicResourcesPageCount}
                      onPageClick={processPageNumber}
                    />
                  </div>
                </div>
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
  topicVerified: PropTypes.bool,
  topicCreator: PropTypes.string,
  isNew: PropTypes.bool,
};

export async function getServerSideProps({
  req,
  params: { topicSlug },
  query,
}) {
  try {
    const topic = await getTopicBySlug(topicSlug);

    return {
      props: {
        topicId: topic.id,
        topicName: topic.name,
        topicSlug: topic.slug,
        topicVerified: topic.verified,
        topicCreator: topic.createdBy?.username ?? 'Unknown',
        isNew: query?.new === 'true',
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
}

export default TopicDetails;
