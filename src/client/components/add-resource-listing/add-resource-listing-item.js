import React from 'react';
import PropTypes from 'prop-types';
import ListingItem from '../listing-item/listing-item';
import { Plus } from 'react-bootstrap-icons';

function AddResourceListingItem({ availableResource, onAddResource }) {
  const addResource = () => onAddResource(availableResource.id);

  const { alreadyAdded, addError } = availableResource;
  const getNameDisplayClass = () => {
    if (alreadyAdded) {
      return 'text-decoration-line-through';
    }

    return '';
  };

  return (
    <ListingItem>
      <div className="row align-items-center justify-content-between text-center text-sm-start">
        <div className="col-sm-auto">
          <div>
            <div className={getNameDisplayClass()}>
              {availableResource.name}
            </div>
            {alreadyAdded && (
              <div className="fst-italic fs-6 text-danger">Already added</div>
            )}
            {addError && (
              <div className="fs-6 text-danger">
                Failed to add topic resource.
              </div>
            )}
          </div>
        </div>
        <div className="col-sm-auto mt-3 mt-sm-0">
          <button
            className="btn btn-primary"
            onClick={addResource}
            disabled={alreadyAdded}
          >
            <Plus fill="white" width="25" height="25" />
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
