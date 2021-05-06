import React from 'react';
import PropTypes from 'prop-types';
import Layout from '../../../components/layout/layout';
import BreadcrumbListing from '../../../components/breadcrumb-listing/breadcrumb-listing';
import useTopicName from '../../../hooks/use-topic-name';

function TopicResourceDetails({ topicId, resourceId }) {
  const topicName = useTopicName(topicId);

  const breadcrumbs = [
    {
      to: '/',
      title: 'Topics',
    },
    {
      to: `/topics/${topicId}`,
      title: topicName ?? 'Topic Details',
    },
    {
      to: `/topics/${topicId}/resources/${resourceId}`,
      title: 'Resource Details',
    },
  ];

  return (
    <Layout>
      <BreadcrumbListing breadcrumbs={breadcrumbs} />
    </Layout>
  );
}

TopicResourceDetails.propTypes = {
  topicId: PropTypes.string,
  resourceId: PropTypes.string,
};

export default TopicResourceDetails;
