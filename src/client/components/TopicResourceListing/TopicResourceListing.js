import React from 'react';
import PropTypes from 'prop-types';
import styles from './TopicResourceListing.module.css';
import TopicResourceListingItem from '../TopicResourceListingItem/TopicResourceListingItem';

const TopicResourceListing = ({ topicId, topicResources }) => {
  const topicResourcesListingItems = topicResources.map((r, index) => {
    const isLast = index === topicResources.length - 1;
    const className = isLast ? '' : 'border-b';

    return (
      <div key={r.resource.id} className={className}>
        <TopicResourceListingItem
          topicId={topicId}
          resourceId={r.resource.id}
          name={r.resource.name}
          rating={r.ratingList.average}
          link={r.resource.link}
        />
      </div>
    );
  });

  return (
    <div
      className={styles.TopicResourceListing}
      data-testid="TopicResourceListing"
    >
      {topicResourcesListingItems}
    </div>
  );
};

TopicResourceListing.propTypes = {
  topicId: PropTypes.string,
  topicResources: PropTypes.array,
};

TopicResourceListing.defaultProps = {
  topicResources: [],
};

export default TopicResourceListing;
