import React from 'react';
import PropTypes from 'prop-types';
import styles from './TopicListing.module.css';
import TopicListingItem from '../TopicListingItem/TopicListingItem';

const TopicListing = ({ topics }) => {
  const topicListingItems = topics.map((t, index) => {
    const isLast = index === topics.length - 1;
    const className = isLast ? '' : 'border-b';

    return (
      <div key={t.id} className={className}>
        <TopicListingItem name={t.name} slug={t.slug} verified={t.verified} />
      </div>
    );
  });

  return (
    <div className={styles.TopicListing} data-testid="TopicListing">
      {topicListingItems}
    </div>
  );
};

TopicListing.propTypes = {
  topics: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      slug: PropTypes.string,
      verified: PropTypes.bool,
    })
  ),
};

TopicListing.defaultProps = {
  topics: [],
};

export default TopicListing;
