import React from 'react';
import PropTypes from 'prop-types';
import styles from './TextInput.module.css';
import { Error } from '@material-ui/icons';

const TextInput = React.forwardRef(function WrappedTextInput(
  { name, label, errorMessage, ...others },
  ref
) {
  const calculateInputClassName = () => {
    let className = 'mt-2 form-control flex-grow';

    if (errorMessage) {
      className += ` ${styles.ErrorTextInput}`;
    }

    return className;
  };

  return (
    <div className={styles.TextInput} data-testid="TextInput">
      <div className="flex flex-col">
        {label && <label htmlFor={name}>{label}</label>}

        <input
          ref={ref}
          name={name}
          className={calculateInputClassName()}
          type="text"
          {...others}
        />

        {errorMessage && (
          <div className="mt-2 error-text text-sm flex items-center">
            <div>
              <Error />
            </div>
            <div className="ml-2">{errorMessage}</div>
          </div>
        )}
      </div>
    </div>
  );
});

TextInput.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  errorMessage: PropTypes.string,
};

TextInput.defaultProps = {};

export default TextInput;
