import React from 'react';
import PropTypes from 'prop-types';
import styles from './AvailableResourceListingItem.module.css';
import ListingItem from '../ListingItem/ListingItem';
import { Add } from '@material-ui/icons';

const AvailableResourceListingItem = ({ resource, onAdd }) => {
  const { name, alreadyAdded, hasAddError } = resource;

  const onAddClick = () => onAdd(resource);

  const calculateNameDisplayClassName = () => {
    if (alreadyAdded) {
      return 'line-through';
    }

    return '';
  };

  return (
    <div
      className={styles.AvailableResourceListingItem}
      data-testid="AvailableResourceListingItem"
    >
      <ListingItem>
        <div className="text-center sm:text-left sm:flex sm:justify-between sm:items-center">
          <div>
            <div className={calculateNameDisplayClassName()}>{name}</div>
            {alreadyAdded && (
              <div className="error-text italic text-xs">Already added</div>
            )}
            {hasAddError && (
              <div className="error-text text-xs">
                Failed to add topic resource.
              </div>
            )}
          </div>

          <div className="mt-5 sm:mt-0 sm:ml-5">
            <button
              className="btn btn-primary"
              onClick={onAddClick}
              disabled={alreadyAdded}
              data-testid="AddResourceButton"
            >
              <Add fill="white" />
            </button>
          </div>
        </div>
      </ListingItem>
    </div>
  );
};

AvailableResourceListingItem.propTypes = {
  resource: PropTypes.object,
  onAdd: PropTypes.func,
};

AvailableResourceListingItem.defaultProps = {
  resource: {},
};

export default AvailableResourceListingItem;
