import React from 'react';
import BreadcrumbLayout from '@/components/BreadcrumbLayout/BreadcrumbLayout';
import LoadingErrorEmptyDataLayout from '@/components/LoadingErrorEmptyDataLayout/LoadingErrorEmptyDataLayout';
import useAuthenticationState from '@/hooks/use-authentication-context';
import PageHeaderButton from '@/components/PageHeaderButton/PageHeaderButton';
import { useRouter } from 'next/router';
import TopicListing from '@/components/TopicListing/TopicListing';
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner';
import { NextSeo } from 'next-seo';
import useTopicSearch from '@/hooks/topics/use-topic-search';
import Pagination from '@/components/Pagination/Pagination';

const DEFAULT_SEARCH_LIMIT = 10;

export default function Topics() {
  const router = useRouter();
  const { isLoggedIn } = useAuthenticationState();
  const { q: searchQuery } = router.query;

  const {
    data: topicsData,
    error: topicsError,
    isLoading: isLoadingTopics,
    searchVariables: { search },
    currentSearchVariables: { search: currentSearch, limit },
    debounceProcessSearch,
    currentPage,
    processPageNumber,
  } = useTopicSearch({
    initialSearchVariables: {
      search: searchQuery ?? '',
      offset: 0,
      limit: DEFAULT_SEARCH_LIMIT,
    },
  });

  const onSearchChange = (e) => {
    const searchInput = e.target.value;
    debounceProcessSearch({
      search: searchInput,
      offset: 0,
      limit: DEFAULT_SEARCH_LIMIT,
    });
  };

  const topics = topicsData?.topics?.items ?? [];
  const totalTopicsCount = topicsData?.topics?.totalCount;
  const topicsPageCount = Math.ceil(totalTopicsCount / limit);
  const hasTopics = topics?.length > 0;

  const breadcrumbs = [
    {
      to: '/topics',
      title: 'Topics',
    },
  ];

  return (
    <div data-testid="Topics">
      <BreadcrumbLayout breadcrumbs={breadcrumbs}>
        <NextSeo
          title="Topics"
          openGraph={{
            title: 'Browse Topics - Resource Rank',
            description:
              'Find the topic you are planning to learn, or find a new topic to learn!',
          }}
        />

        <PageHeaderButton
          title="Topics"
          linkTo="/topics/new"
          buttonContent="New"
          hideButton={!isLoggedIn}
        />

        <div className="mt-8 flex flex-col">
          <input
            data-testid="SearchInput"
            className="flex-grow form-control-lg"
            placeholder="Search topics..."
            value={search}
            onChange={onSearchChange}
            type="text"
          />

          <div className="mt-8">
            <LoadingErrorEmptyDataLayout
              isLoading={isLoadingTopics}
              loadingDisplay={
                <div className="text-center">
                  <LoadingSpinner />
                </div>
              }
              hasError={!!topicsError}
              errorDisplay={
                <div className="text-center sm:text-left error-text">
                  Failed to load topics.
                </div>
              }
              hasData={hasTopics}
              noDataDisplay={
                <div className="text-center sm:text-left">
                  {!currentSearch && 'No topics have been created.'}
                  {currentSearch &&
                    `No topics matching '${currentSearch}' have been created.`}
                </div>
              }
              dataDisplay={
                <div>
                  <TopicListing topics={topics} />

                  <div className="mt-8 flex justify-center">
                    <Pagination
                      selectedPage={currentPage}
                      pageCount={topicsPageCount}
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
}
