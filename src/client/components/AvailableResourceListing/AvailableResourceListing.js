import React from 'react';
import PropTypes from 'prop-types';
import styles from './AvailableResourceListing.module.css';
import AvailableResourceListingItem from '../AvailableResourceListingItem/AvailableResourceListingItem';
import PaginatedListing from '../PaginatedListing/PaginatedListing';

const AvailableResourceListing = ({
  resources,
  onAddResource,
  selectedPage,
  pageCount,
  onPageClick,
}) => {
  const availableResourceListingItems = resources.map((r) => (
    <AvailableResourceListingItem
      key={r.id}
      resource={r}
      onAdd={onAddResource}
    />
  ));

  return (
    <div
      className={styles.AvailableResourceListing}
      data-testid="AvailableResourceListing"
    >
      <PaginatedListing
        selectedPage={selectedPage}
        pageCount={pageCount}
        onPageClick={onPageClick}
      >
        {availableResourceListingItems}
      </PaginatedListing>
    </div>
  );
};

AvailableResourceListing.propTypes = {
  resources: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      verified: PropTypes.bool,
      alreadyAdded: PropTypes.bool,
      hasAddError: PropTypes.bool,
      isAdding: PropTypes.bool,
      disableAdd: PropTypes.bool,
    })
  ),
  onAddResource: PropTypes.func,
  selectedPage: PropTypes.number,
  pageCount: PropTypes.number,
  onPageClick: PropTypes.func,
};

AvailableResourceListing.defaultProps = {
  resources: [],
};

export default AvailableResourceListing;
