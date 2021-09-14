import React from 'react';
import PropTypes from 'prop-types';
import styles from './TopicResourceListing.module.css';
import TopicResourceListingItem from '../TopicResourceListingItem/TopicResourceListingItem';
import Listing from '../Listing/Listing';

const TopicResourceListing = ({ topicId, topicSlug, topicResources }) => {
  const topicResourcesListingItems = topicResources.map((r) => (
    <TopicResourceListingItem
      key={r.resource.id}
      topicId={topicId}
      topicSlug={topicSlug}
      resourceId={r.resource.id}
      resourceSlug={r.resource.slug}
      name={r.resource.name}
      rating={r.ratingList.average}
      verified={r.resource.verified}
    />
  ));

  return (
    <div
      className={styles.TopicResourceListing}
      data-testid="TopicResourceListing"
    >
      <Listing>{topicResourcesListingItems}</Listing>
    </div>
  );
};

TopicResourceListing.propTypes = {
  topicId: PropTypes.string,
  topicSlug: PropTypes.string,
  topicResources: PropTypes.arrayOf(
    PropTypes.shape({
      resource: PropTypes.shape({
        id: PropTypes.string,
        slug: PropTypes.string,
        name: PropTypes.string,
        verified: PropTypes.bool,
      }),
      ratingList: PropTypes.shape({
        average: PropTypes.number,
      }),
    })
  ),
};

TopicResourceListing.defaultProps = {
  topicResources: [],
};

export default TopicResourceListing;
