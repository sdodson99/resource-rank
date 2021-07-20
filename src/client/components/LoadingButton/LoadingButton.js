import React from 'react';
import PropTypes from 'prop-types';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';

const LoadingButton = ({ isLoading, onClick, children }) => (
  <button
    className="btn btn-primary"
    data-testid="LoadingButton"
    onClick={onClick}
  >
    {isLoading && (
      <div>
        <LoadingSpinner width={20} height={20} />
      </div>
    )}
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
