import React from 'react';
import PropTypes from 'prop-types';
import styles from './TopicListing.module.css';
import TopicListingItem from '../TopicListingItem/TopicListingItem';
import PaginatedListing from '../PaginatedListing/PaginatedListing';

const TopicListing = ({ topics, selectedPage, pageCount, onPageClick }) => {
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
      <PaginatedListing
        selectedPage={selectedPage}
        pageCount={pageCount}
        onPageClick={onPageClick}
      >
        {topicListingItems}
      </PaginatedListing>
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
  selectedPage: PropTypes.number,
  pageCount: PropTypes.number,
  onPageClick: PropTypes.func,
};

TopicListing.defaultProps = {
  topics: [],
};

export default TopicListing;
