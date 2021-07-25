import React from 'react';
import PropTypes from 'prop-types';
import styles from './AvailableResourceListing.module.css';
import AvailableResourceListingItem from '../AvailableResourceListingItem/AvailableResourceListingItem';

const AvailableResourceListing = ({ resources, onAddResource }) => {
  const availableResourceListingItems = resources
    .sort((r1, r2) => r1.alreadyAdded - r2.alreadyAdded)
    .map((r, index) => {
      const isLast = index === resources.length - 1;
      const className = isLast ? '' : 'border-b';

      return (
        <div key={r.id} className={className}>
          <AvailableResourceListingItem resource={r} onAdd={onAddResource} />
        </div>
      );
    });

  return (
    <div
      className={styles.AvailableResourceListing}
      data-testid="AvailableResourceListing"
    >
      {availableResourceListingItems}
    </div>
  );
};

AvailableResourceListing.propTypes = {
  resources: PropTypes.array,
  onAddResource: PropTypes.func,
};

AvailableResourceListing.defaultProps = {
  resources: [],
};

export default AvailableResourceListing;
