import React from 'react';
import PropTypes from 'prop-types';
import styles from './ListingItem.module.css';

const ListingItem = ({ children, hover, xPadding }) => {
  const getClassName = () => {
    let className = styles.ListingItem;

    if (hover) {
      className += ` ${styles.HoverListingItem}`;
    }

    if (xPadding) {
      className += ' px-3';
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
  xPadding: PropTypes.bool,
};

ListingItem.defaultProps = {
  hover: false,
  xPadding: true,
};

export default ListingItem;
