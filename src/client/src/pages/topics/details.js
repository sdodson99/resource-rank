import React from 'react';
import PropTypes from 'prop-types';
import Layout from '../../components/layout/layout';
import TopicResourceListing from '../../components/topic-resource-listing/topic-resource-listing';
import { Link } from 'gatsby';
import BreadcrumbListing from '../../components/breadcrumbs/breadcrumb-listing';
import useTopicById from '../../hooks/use-topic-by-id';
import { Spinner } from 'react-bootstrap';

function TopicDetails({ topicId }) {
  const {
    loading: isLoadingTopic,
    data: topicData,
    error: topicError,
  } = useTopicById(topicId);

  const id = topicData?.topic?.id;
  const name = topicData?.topic?.name;
  const resources = topicData?.topic?.resources ?? [];
  const hasResources = resources.length > 0;

  const orderedResources = resources.sort(
    (r1, r2) => r2.ratingList?.average - r1.ratingList?.average
  );

  const breadcrumbs = [
    {
      to: '/',
      title: 'Topics',
    },
    {
      to: `/topics/${topicId}`,
      title: name ?? 'Topic Details',
    },
  ];

  return (
    <Layout>
      <BreadcrumbListing breadcrumbs={breadcrumbs} />

      <div className="mt-4">
        {isLoadingTopic && (
          <div className="text-center">
            <Spinner animation="border" role="status" />
          </div>
        )}

        {!isLoadingTopic && (
          <div>
            {topicError && (
              <div className="text-center text-sm-start">
                Failed to load topic details.
              </div>
            )}

            {!topicError && (
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
