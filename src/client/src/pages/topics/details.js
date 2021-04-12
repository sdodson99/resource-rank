import React from 'react';
import PropTypes from 'prop-types';

import Layout from '../../components/layout/layout';
import { useQuery } from '@apollo/client';
import getTopicByIdQuery from '../../gql-requests/get-topic-by-id-query';
import ResourceListing from '../../components/resource-listing/resource-listing';
import { Link } from 'gatsby';

function TopicDetails({ topicId }) {
  const { loading: isLoadingTopic, data } = useQuery(getTopicByIdQuery, {
    variables: { id: topicId },
    fetchPolicy: 'no-cache',
  });

  const id = data?.topic?.id;
  const name = data?.topic?.name;
  const resources = data?.topic?.resources ?? [];
  const hasResources = resources.length > 0;

  return (
    <Layout>
      <div>
        {isLoadingTopic && <div>Loading...</div>}
        {!isLoadingTopic && (
          <div>
            <div className="page-header text-center text-sm-start">{name}</div>

            <div className="mt-4 row align-items-center justify-content-between text-center text-sm-start">
              <div className="col-sm-auto">
                <div className="font-md">Resources</div>
              </div>
              <div className="col-sm-auto mt-2 mt-sm-0">
                <Link
                  className="btn btn-primary font-sm"
                  to={`/topics/${id}/resources/create`}
                >
                  Create
                </Link>
              </div>
            </div>

            <div className="mt-4">
              {hasResources && <ResourceListing resources={resources} />}
              {!hasResources && (
                <div className="font-xs">No resources have been created.</div>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

TopicDetails.propTypes = {
  topicId: PropTypes.string,
};

export default TopicDetails;
