import React from 'react';
import PropTypes from 'prop-types';
import AddResourceListingItem from './add-resource-listing-item';

function AddResourceListing({ availableResources, onAddResource }) {
  const addResourceListingItems = availableResources
    .sort((r1, r2) => r1.alreadyAdded - r2.alreadyAdded)
    .map((r) => (
      <div key={r.id}>
        <AddResourceListingItem
          availableResource={r}
          onAddResource={onAddResource}
        />
      </div>
    ));

  return addResourceListingItems;
}

AddResourceListing.propTypes = {
  availableResources: PropTypes.array,
  onAddResource: PropTypes.func,
};

export default AddResourceListing;
