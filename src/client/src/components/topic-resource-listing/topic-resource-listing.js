import React from 'react';
import PropTypes from 'prop-types';
import TopicResourceListingItem from '../topic-resource-listing-item/topic-resource-listing-item';

function TopicResourceListing({ topicId, topicResources }) {
  const topicResourcesListingItems = topicResources.map((r) => (
    <div key={r.resource.id}>
      <TopicResourceListingItem
        topicId={topicId}
        resourceId={r.resource.id}
        name={r.resource.name}
        rating={r.ratingList.average}
        link={r.resource.link}
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
