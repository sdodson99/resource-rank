import React from 'react';
import PropTypes from 'prop-types';
import TopicResourceListing from '../../components/topic-resource-listing/topic-resource-listing';
import { Link } from 'gatsby';
import useTopicById from '../../hooks/use-topic-by-id';
import { Spinner } from 'react-bootstrap';
import BreadcrumbLayout from '../../components/layouts/breadcrumb-layout';

function TopicDetails({ topicId }) {
  const {
    loading: isLoadingTopic,
    data: topicData,
    error: topicLoadError,
  } = useTopicById(topicId);

  const topic = topicData?.topic;
  const id = topic?.id;
  const name = topic?.name;
  const resources = topic?.resources ?? [];
  const hasResources = resources.length > 0;
  const hasTopicError = !topic || topicLoadError;

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
      title: name,
    },
  ];

  return (
    <BreadcrumbLayout breadcrumbs={breadcrumbs}>
      <div>
        {isLoadingTopic && (
          <div className="text-center">
            <Spinner animation="border" role="status" />
          </div>
        )}

        {!isLoadingTopic && (
          <div>
            {hasTopicError && (
              <div className="text-center text-sm-start">
                Failed to load topic details.
              </div>
            )}

            {!hasTopicError && (
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
    </BreadcrumbLayout>
  );
}

TopicDetails.propTypes = {
  topicId: PropTypes.string,
};

export default TopicDetails;
