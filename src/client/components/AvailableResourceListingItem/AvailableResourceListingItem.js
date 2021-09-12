import React from 'react';
import PropTypes from 'prop-types';
import styles from './AvailableResourceListingItem.module.css';
import ListingItem from '../ListingItem/ListingItem';
import { Add } from '@material-ui/icons';
import VerifiedIcon from '../VerifiedIcon/VerifiedIcon';
import LoadingButton from '../LoadingButton/LoadingButton';

const AvailableResourceListingItem = ({ resource, onAdd }) => {
  const { name, verified, alreadyAdded, hasAddError, isAdding, disableAdd } =
    resource;

  const onAddClick = () => onAdd && onAdd(resource);

  const calculateNameDisplayClassName = () => {
    if (alreadyAdded) {
      return 'line-through';
    }

    return '';
  };

  const calculateAddDisabled = () => isAdding || alreadyAdded || disableAdd;

  return (
    <div
      className={styles.AvailableResourceListingItem}
      data-testid="AvailableResourceListingItem"
    >
      <ListingItem xPadding={false}>
        <div className="text-center sm:text-left sm:flex sm:justify-between sm:items-center">
          <div>
            <div className="flex items-center justify-center sm:justify-start">
              <div className={calculateNameDisplayClassName()}>{name}</div>
              {verified && (
                <div className="ml-2">
                  <VerifiedIcon />
                </div>
              )}
            </div>
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
            <LoadingButton
              onClick={onAddClick}
              disabled={calculateAddDisabled()}
              isLoading={isAdding}
              testid="AddResourceButton"
            >
              <Add fill="white" />
            </LoadingButton>
          </div>
        </div>
      </ListingItem>
    </div>
  );
};

AvailableResourceListingItem.propTypes = {
  resource: PropTypes.shape({
    name: PropTypes.string,
    verified: PropTypes.bool,
    alreadyAdded: PropTypes.bool,
    hasAddError: PropTypes.bool,
    disableAdd: PropTypes.bool,
    isAdding: PropTypes.bool,
  }).isRequired,
  onAdd: PropTypes.func,
};

AvailableResourceListingItem.defaultProps = {
  resource: {
    name: '',
  },
};

export default AvailableResourceListingItem;
