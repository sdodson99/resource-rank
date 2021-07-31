import React from 'react';
import PropTypes from 'prop-types';
import styles from './EmptyRatingStar.module.css';

const EmptyRatingStar = () => (
  <div className={styles.EmptyRatingStar} data-testid="EmptyRatingStar">
    EmptyRatingStar Component
  </div>
);

EmptyRatingStar.propTypes = {};

EmptyRatingStar.defaultProps = {};

export default EmptyRatingStar;
