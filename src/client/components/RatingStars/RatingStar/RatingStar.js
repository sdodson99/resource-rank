import React from 'react';
import PropTypes from 'prop-types';
import styles from './RatingStar.module.css';

const RatingStar = () => (
  <div className={styles.RatingStar} data-testid="RatingStar">
    RatingStar Component
  </div>
);

RatingStar.propTypes = {};

RatingStar.defaultProps = {};

export default RatingStar;
