import React from 'react';
import PropTypes from 'prop-types';

function LiveValidatingInput({
  id,
  value,
  onChange,
  isValidating,
  hasValidationError,
  validationErrorMessage,
  required = false,
}) {
  return (
    <div>
      <input
        required={required}
        id={id}
        value={value}
        onChange={onChange}
        className="mt-1 form-control"
        type="text"
      />

      {isValidating && (
        <div className="d-flex align-items-center mt-2">
          <div
            className="spinner-border spinner-border-sm text-dark"
            role="status"
          >
            <span className="visually-hidden">Loading...</span>
          </div>

          <div className="fs-6 ms-2">Validating... </div>
        </div>
      )}

      {hasValidationError && (
        <div className="mt-2 fs-6 text-danger">{validationErrorMessage}</div>
      )}
    </div>
  );
}

LiveValidatingInput.propTypes = {
  id: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  isValidating: PropTypes.bool,
  hasValidationError: PropTypes.bool,
  validationErrorMessage: PropTypes.string,
  required: PropTypes.bool,
};

export default LiveValidatingInput;
