import React from 'react';
import { useQuery } from '@apollo/client';

import Layout from '../components/layout/layout';
import TopicListing from '../components/topic-listing/topic-listing';
import getTopicsQuery from '../gql-requests/get-topics-query';
import HeaderButton from '../components/header-button/header-button';

export default function Home() {
  const { loading: isLoadingTopics, data } = useQuery(getTopicsQuery, {
    fetchPolicy: 'no-cache',
  });

  const topics = data?.topics ?? [];

  return (
    <Layout>
      <HeaderButton
        title="Topics"
        linkTo="/topics/create"
        buttonContent="Create"
      />
      <div className="mt-4">
        {isLoadingTopics && <div>Loading...</div>}
        {!isLoadingTopics && <TopicListing topics={topics} />}
      </div>
    </Layout>
  );
}
