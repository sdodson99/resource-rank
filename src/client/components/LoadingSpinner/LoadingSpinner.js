import React from 'react';
import PropTypes from 'prop-types';
import styles from './LoadingSpinner.module.css';

const LoadingSpinner = ({ height, width }) => (
  <div className={styles.LoadingSpinner} data-testid="LoadingSpinner">
    <img
      className="animate-spin align-middle"
      src="/img/spinner.svg"
      height={height}
      width={width}
    />
  </div>
);

LoadingSpinner.propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
};

LoadingSpinner.defaultProps = {
  height: 50,
  width: 50,
};

export default LoadingSpinner;
