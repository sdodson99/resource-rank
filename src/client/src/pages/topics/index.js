import React from 'react';
import { useQuery } from '@apollo/client';

import Layout from '../../components/layout/layout';
import TopicListing from '../../components/topic-listing/topic-listing';
import getTopicsQuery from '../../gql-requests/get-topics-query';
import HeaderButton from '../../components/header-button/header-button';
import BreadcrumbListing from '../../components/breadcrumbs/breadcrumb-listing';
import { Spinner } from 'react-bootstrap';

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
    <Layout>
      <BreadcrumbListing breadcrumbs={breadcrumbs} />

      <HeaderButton
        title="Topics"
        linkTo="/topics/new"
        buttonContent="New"
        className="mt-4"
      />

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
    </Layout>
  );
}
