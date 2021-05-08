import React from 'react';
import PropTypes from 'prop-types';

import Layout from '../../components/layout/layout';
import { useApolloClient, useQuery } from '@apollo/client';
import getTopicByIdQuery from '../../gql-requests/get-topic-by-id-query';
import TopicResourceListing from '../../components/topic-resource-listing/topic-resource-listing';
import { Link } from 'gatsby';
import BreadcrumbListing from '../../components/breadcrumbs/breadcrumb-listing';
import getTopicNameByIdQuery from '../../gql-requests/get-topic-name-by-id-query';

function TopicDetails({ topicId }) {
  const apolloClient = useApolloClient();
  const { loading: isLoadingTopic, data, error } = useQuery(getTopicByIdQuery, {
    variables: { id: topicId },
    onCompleted: (data) => {
      const topicName = data?.topic?.name;

      if (topicName) {
        apolloClient.writeQuery({
          query: getTopicNameByIdQuery,
          variables: { id: topicId },
          data: {
            topic: {
              name: topicName,
            },
          },
        });
      }
    },
  });

  const id = data?.topic?.id;
  const name = data?.topic?.name;
  const resources = data?.topic?.resources ?? [];
  const hasResources = resources.length > 0;

  const orderedResources = resources.sort(
    (r1, r2) => r2.ratingList.average - r1.ratingList.average
  );

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
          <div className="text-center">
            <div className="spinner-border text-dark" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}

        {!isLoadingTopic && (
          <div>
            {error && (
              <div className="text-center text-sm-start">
                Failed to load topic details.
              </div>
            )}

            {!error && (
              <div className="text-center text-sm-start">
                <div className="page-header">Topic: {name}</div>

                <div className="mt-4 row align-items-center justify-content-between">
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
                  {hasResources && (
                    <TopicResourceListing
                      topicId={topicId}
                      topicResources={orderedResources}
                    />
                  )}
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
