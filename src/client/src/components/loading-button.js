import React from 'react';
import PropTypes from 'prop-types';
import { Button, Spinner } from 'react-bootstrap';

function LoadingButton({ isLoading, onClick, children, variant }) {
  return (
    <Button variant={variant} onClick={onClick}>
      {isLoading && <Spinner size="sm" animation="border" role="status" />}
      {!isLoading && children}
    </Button>
  );
}

LoadingButton.propTypes = {
  isLoading: PropTypes.bool,
  onClick: PropTypes.func,
  children: PropTypes.node,
  variant: PropTypes.string,
};

export default LoadingButton;
