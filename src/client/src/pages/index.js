import React from 'react';
import { useQuery } from '@apollo/client';

import Layout from '../components/layout/layout';
import TopicListing from '../components/topic-listing/topic-listing';
import getTopicsQuery from '../gql-requests/get-topics-query';
import HeaderButton from '../components/header-button/header-button';
import BreadcrumbListing from '../components/breadcrumb-listing/breadcrumb-listing';

export default function Home() {
  const { loading: isLoadingTopics, data } = useQuery(getTopicsQuery, {
    fetchPolicy: 'no-cache',
  });

  const topics = data?.topics ?? [];

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
        {isLoadingTopics && <div>Loading...</div>}
        {!isLoadingTopics && <TopicListing topics={topics} />}
      </div>
    </Layout>
  );
}
