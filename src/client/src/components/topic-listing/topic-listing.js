import React from 'react';
import PropTypes from 'prop-types';
import TopicListingItem from '../topic-listing-item/topic-listing-item';

function TopicListing({ topics }) {
  const topicListingItems = topics.map((t) => (
    <TopicListingItem key={t.id} id={t.id} name={t.name} />
  ));

  return <div>{topicListingItems}</div>;
}

TopicListing.propTypes = {
  topics: PropTypes.array,
};

export default TopicListing;
