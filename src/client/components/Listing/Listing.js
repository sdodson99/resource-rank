import React from 'react';
import PropTypes from 'prop-types';
import styles from './Listing.module.css';

const Listing = ({ children }) => (
  <div className={styles.Listing} data-testid="Listing">
    {children}
  </div>
);

Listing.propTypes = {
  children: PropTypes.node,
};

Listing.defaultProps = {};

export default Listing;
