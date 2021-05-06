import React from 'react';
import PropTypes from 'prop-types';
import TopicResourceListingItem from '../topic-resource-listing-item/topic-resource-listing-item';

function TopicResourceListing({ topicId, topicResources }) {
  const topicResourcesListingItems = topicResources.map((r) => (
    <div key={r.resourceInfo.id}>
      <TopicResourceListingItem
        topicId={topicId}
        resourceId={r.resourceInfo.id}
        name={r.resourceInfo.name}
        ratings={r.ratings}
        link={r.resourceInfo.link}
      />
    </div>
  ));

  return <div>{topicResourcesListingItems}</div>;
}

TopicResourceListing.propTypes = {
  topicId: PropTypes.string,
  topicResources: PropTypes.array,
};

export default TopicResourceListing;
