import React from 'react';
import PropTypes from 'prop-types';
import styles from './TopicListing.module.css';
import TopicListingItem from '../TopicListingItem/TopicListingItem';

const TopicListing = ({ topics }) => {
  const topicListingItems = topics.map((t) => (
    <div key={t.id}>
      <TopicListingItem id={t.id} name={t.name} />
    </div>
  ));

  return (
    <div className={styles.TopicListing} data-testid="TopicListing">
      {topicListingItems}
    </div>
  );
};

TopicListing.propTypes = {
  topics: PropTypes.array,
};

TopicListing.defaultProps = {
  topics: [],
};

export default TopicListing;
