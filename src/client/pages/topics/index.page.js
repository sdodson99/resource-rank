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

export default function Topics() {
  const router = useRouter();
  const { isLoggedIn } = useAuthenticationState();
  const { q: searchQuery } = router.query;

  const {
    data: topicsData,
    error: topicsError,
    isLoading: isLoadingTopics,
    search,
    currentSearch,
    processSearch,
  } = useTopicSearch({
    initialSearch: searchQuery,
  });

  const onSearchChange = (e) => {
    const searchInput = e.target.value;
    processSearch(searchInput);
  };

  const topics = topicsData?.topics.filter((t) => t.slug) ?? [];
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
              dataDisplay={<TopicListing topics={topics} />}
            />
          </div>
        </div>
      </BreadcrumbLayout>
    </div>
  );
}
