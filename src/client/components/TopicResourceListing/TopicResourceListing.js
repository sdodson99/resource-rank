import React from 'react';
import PropTypes from 'prop-types';
import styles from './TopicResourceListing.module.css';
import TopicResourceListingItem from '../TopicResourceListingItem/TopicResourceListingItem';
import PaginatedListing from '../PaginatedListing/PaginatedListing';

const TopicResourceListing = ({
  topicId,
  topicSlug,
  topicResources,
  selectedPage,
  pageCount,
  onPageClick,
}) => {
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
      <PaginatedListing
        selectedPage={selectedPage}
        pageCount={pageCount}
        onPageClick={onPageClick}
      >
        {topicResourcesListingItems}
      </PaginatedListing>
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
  selectedPage: PropTypes.number,
  pageCount: PropTypes.number,
  onPageClick: PropTypes.func,
};

TopicResourceListing.defaultProps = {
  topicResources: [],
};

export default TopicResourceListing;
