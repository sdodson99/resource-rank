import React from 'react';
import PropTypes from 'prop-types';
import styles from './AvailableResourceListing.module.css';
import AvailableResourceListingItem from '../AvailableResourceListingItem/AvailableResourceListingItem';
import Listing from '../Listing/Listing';

const AvailableResourceListing = ({ resources, onAddResource }) => {
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
      <Listing>{availableResourceListingItems}</Listing>
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
};

AvailableResourceListing.defaultProps = {
  resources: [],
};

export default AvailableResourceListing;
