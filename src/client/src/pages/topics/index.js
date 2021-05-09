import React from 'react';
import { useQuery } from '@apollo/client';
import TopicListing from '../../components/topic-listing/topic-listing';
import getTopicsQuery from '../../gql-requests/get-topics-query';
import HeaderButton from '../../components/header-button/header-button';
import { Spinner } from 'react-bootstrap';
import BreadcrumbLayout from '../../components/layouts/breadcrumb-layout';

export default function Home() {
  const {
    loading: loadingTopics,
    data: topicsData,
    error: topicsError,
  } = useQuery(getTopicsQuery);

  const topics = topicsData?.topics ?? [];

  const breadcrumbs = [
    {
      to: '/',
      title: 'Topics',
    },
  ];

  return (
    <BreadcrumbLayout breadcrumbs={breadcrumbs}>
      <HeaderButton title="Topics" linkTo="/topics/new" buttonContent="New" />

      <div className="mt-4">
        {loadingTopics && (
          <div className="text-center">
            <Spinner animation="border" role="status" />
          </div>
        )}

        {!loadingTopics && (
          <div>
            {topicsError && (
              <div className="text-center text-sm-start">
                Failed to load topics.
              </div>
            )}

            {!topicsError && <TopicListing topics={topics} />}
          </div>
        )}
      </div>
    </BreadcrumbLayout>
  );
}
