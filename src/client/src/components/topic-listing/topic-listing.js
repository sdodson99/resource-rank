import React from 'react';
import PropTypes from 'prop-types';
import TopicListingItem from '../topic-listing-item/topic-listing-item';

function TopicListing({ topics }) {
  const topicListingItems = topics.map((t) => (
    <div key={t.id} className="mb-2">
      <TopicListingItem id={t.id} name={t.name} />
    </div>
  ));

  return <div>{topicListingItems}</div>;
}

TopicListing.propTypes = {
  topics: PropTypes.array,
};

export default TopicListing;
