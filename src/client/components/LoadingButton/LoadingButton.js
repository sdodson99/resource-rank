import React from 'react';
import PropTypes from 'prop-types';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';

const LoadingButton = ({ isLoading, onClick, children, disabled, testid }) => (
  <button
    className="btn btn-primary"
    data-testid={testid}
    onClick={onClick}
    disabled={disabled}
  >
    {isLoading && (
      <div>
        <LoadingSpinner size={20} color="white" />
      </div>
    )}
    {!isLoading && children}
  </button>
);

LoadingButton.propTypes = {
  isLoading: PropTypes.bool,
  onClick: PropTypes.func,
  children: PropTypes.node,
  disabled: PropTypes.bool,
  testid: PropTypes.string,
};

LoadingButton.defaultProps = {
  isLoading: false,
  testid: 'LoadingButton',
};

export default LoadingButton;
