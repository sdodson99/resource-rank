import React from 'react';
import PropTypes from 'prop-types';

function LoadingButton({ isLoading, onClick, children, variant }) {
  return (
    <button onClick={onClick}>
      {isLoading && <div>Loading...</div>}
      {!isLoading && children}
    </button>
  );
}

LoadingButton.propTypes = {
  isLoading: PropTypes.bool,
  onClick: PropTypes.func,
  children: PropTypes.node,
  variant: PropTypes.string,
};

export default LoadingButton;
