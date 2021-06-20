import React from 'react';
import PropTypes from 'prop-types';
import styles from './LoadingButton.module.css';

const LoadingButton = ({ isLoading, onClick, children }) => {
  return (
    <button
      className={styles.LoadingButton}
      data-testid="LoadingButton"
      onClick={onClick}
    >
      {isLoading && <div>Loading...</div>}
      {!isLoading && children}
    </button>
  );
};

LoadingButton.propTypes = {
  isLoading: PropTypes.bool,
  onClick: PropTypes.func,
  children: PropTypes.node,
};

LoadingButton.defaultProps = {
  isLoading: false,
};

export default LoadingButton;
