import React from 'react';
import PropTypes from 'prop-types';
import styles from './RatingStarGroup.module.css';

const RatingStarGroup = () => (
  <div className={styles.RatingStarGroup} data-testid="RatingStarGroup">
    RatingStarGroup Component
  </div>
);

RatingStarGroup.propTypes = {};

RatingStarGroup.defaultProps = {};

export default RatingStarGroup;
