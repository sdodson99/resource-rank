import React from 'react';
import PropTypes from 'prop-types';

const LoadingButton = ({ isLoading, onClick, children }) => (
  <button
    className="btn btn-primary"
    data-testid="LoadingButton"
    onClick={onClick}
  >
    {isLoading && <div>Loading...</div>}
    {!isLoading && children}
  </button>
);

LoadingButton.propTypes = {
  isLoading: PropTypes.bool,
  onClick: PropTypes.func,
  children: PropTypes.node,
};

LoadingButton.defaultProps = {
  isLoading: false,
};

export default LoadingButton;
