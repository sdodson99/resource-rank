import React from 'react';
import { useQuery } from '@apollo/client';
import { Link } from 'gatsby';

import Layout from '../components/layout/layout';
import TopicListing from '../components/topic-listing/topic-listing';
import getTopicsQuery from '../gql-requests/get-topics-query';

export default function Home() {
  const { loading: isLoadingTopics, data } = useQuery(getTopicsQuery);

  const getTopics = () => {
    if (!data) {
      return [];
    }

    return data.topics;
  };

  return (
    <Layout>
      <div className="row align-items-center justify-content-between text-center text-sm-start">
        <div className="col-sm-auto">
          <div className="page-header">Topics</div>
        </div>
        <div className="col-sm-auto mt-2 mt-sm-0">
          <Link className="btn btn-primary font-sm" to="/topics/create">
            Create
          </Link>
        </div>
      </div>
      <div className="mt-4">
        {isLoadingTopics && <div>Loading...</div>}
        {!isLoadingTopics && <TopicListing topics={getTopics()} />}
      </div>
    </Layout>
  );
}
