import React from 'react';
import PropTypes from 'prop-types';
import AddResourceListingItem from '../add-resource-listing-item/add-resource-listing-item';

function AddResourceListing({ availableResources, onAddResource }) {
  const addResourceListingItems = availableResources.map((r) => (
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
