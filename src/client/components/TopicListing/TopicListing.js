import React from 'react';
import PropTypes from 'prop-types';
import styles from './TopicListing.module.css';
import TopicListingItem from '../TopicListingItem/TopicListingItem';
import Listing from '../Listing/Listing';

const TopicListing = ({ topics }) => {
  const topicListingItems = topics.map((t) => (
    <TopicListingItem
      key={t.id}
      name={t.name}
      slug={t.slug}
      verified={t.verified}
    />
  ));

  return (
    <div className={styles.TopicListing} data-testid="TopicListing">
      <Listing>{topicListingItems}</Listing>
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
