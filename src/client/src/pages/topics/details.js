import React from 'react';
import PropTypes from 'prop-types';

import Layout from '../../components/layout/layout';
import { useQuery } from '@apollo/client';
import getTopicByIdQuery from '../../gql-requests/get-topic-by-id-query';
import ResourceListing from '../../components/resource-listing/resource-listing';
import { Link } from 'gatsby';
import BreadcrumbListing from '../../components/breadcrumb-listing/breadcrumb-listing';

function TopicDetails({ topicId }) {
  const { loading: isLoadingTopic, data, error } = useQuery(getTopicByIdQuery, {
    variables: { id: topicId },
  });

  const id = data?.topic?.id;
  const name = data?.topic?.name ?? 'Loading...';
  const resources = data?.topic?.resources ?? [];
  const hasResources = resources.length > 0;

  const breadcrumbs = [
    {
      to: '/',
      title: 'Topics',
    },
    {
      to: `/topics/${topicId}`,
      title: name,
    },
  ];

  return (
    <Layout>
      <BreadcrumbListing breadcrumbs={breadcrumbs} />

      <div className="mt-4">
        {isLoadingTopic && (
          <div className="text-center text-sm-start">Loading...</div>
        )}

        {!isLoadingTopic && (
          <div>
            {error && (
              <div className="text-center text-sm-start">
                Failed to load resources.
              </div>
            )}

            {!error && (
              <div>
                <div className="page-header text-center text-sm-start">
                  Topic: {name}
                </div>

                <div className="mt-4 row align-items-center justify-content-between text-center text-sm-start">
                  <div className="col-sm-auto">
                    <div className="font-md">Resources</div>
                  </div>
                  <div className="col-sm-auto mt-2 mt-sm-0">
                    <Link
                      className="btn btn-primary font-sm"
                      to={`/topics/${id}/resources/add`}
                    >
                      Add
                    </Link>
                  </div>
                </div>

                <div className="mt-4">
                  {hasResources && <ResourceListing resources={resources} />}
                  {!hasResources && (
                    <div className="font-xs">
                      No resources have been created.
                    </div>
                  )}
                </div>
              </div>
            )}
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
