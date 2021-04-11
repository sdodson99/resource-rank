import React from 'react';
import PropTypes from 'prop-types';

import Layout from '../../components/layout/layout';

function TopicDetails({ topicId }) {
  return <Layout>{topicId}</Layout>;
}

TopicDetails.propTypes = {
  topicId: PropTypes.string,
};

export default TopicDetails;
