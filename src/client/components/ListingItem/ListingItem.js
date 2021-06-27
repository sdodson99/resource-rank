import React from 'react';
import PropTypes from 'prop-types';
import styles from './ListingItem.module.css';

const ListingItem = ({ children, hover }) => {
  const getClassName = () => {
    let className = styles.ListingItem;

    if (hover) {
      className += ` ${styles.HoverListingItem}`;
    }

    return className;
  };

  return (
    <div className={getClassName()} data-testid="ListingItem">
      {children}
    </div>
  );
};

ListingItem.propTypes = {
  children: PropTypes.node,
  hover: PropTypes.bool,
};

ListingItem.defaultProps = {
  hover: false,
};

export default ListingItem;
