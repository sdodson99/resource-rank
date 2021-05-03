import React from 'react';
import PropTypes from 'prop-types';
import ListingItem from '../listing-item/listing-item';

function AddResourceListingItem({ availableResource, onAddResource }) {
  const addResource = () => onAddResource(availableResource.id);

  return (
    <ListingItem>
      <div className="row align-items-center justify-content-between">
        <div className="col-sm-auto">{availableResource.name}</div>
        <div className="col-sm-auto">
          <button className="btn btn-primary" onClick={addResource}>
            Add
          </button>
        </div>
      </div>
    </ListingItem>
  );
}

AddResourceListingItem.propTypes = {
  availableResource: PropTypes.object,
  onAddResource: PropTypes.func,
};

export default AddResourceListingItem;
