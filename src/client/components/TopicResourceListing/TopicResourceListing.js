import React from 'react';
import PropTypes from 'prop-types';
import styles from './TopicResourceListing.module.css';
import TopicResourceListingItem from '../TopicResourceListingItem/TopicResourceListingItem';

const TopicResourceListing = ({ topicId, topicSlug, topicResources }) => {
  const topicResourcesListingItems = topicResources.map((r, index) => {
    const isLast = index === topicResources.length - 1;
    const className = isLast ? '' : 'border-b';

    return (
      <div key={r.resource.id} className={className}>
        <TopicResourceListingItem
          topicId={topicId}
          topicSlug={topicSlug}
          resourceId={r.resource.id}
          resourceSlug={r.resource.slug}
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
  topicSlug: PropTypes.string,
  topicResources: PropTypes.arrayOf(
    PropTypes.shape({
      resource: PropTypes.shape({
        id: PropTypes.string,
        slug: PropTypes.string,
        name: PropTypes.string,
        link: PropTypes.string,
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
