import React from 'react';
import PropTypes from 'prop-types';
import styles from './ErrorAlert.module.css';
import Alert from '../Alert/Alert';
import { Error as ErrorIcon } from '@material-ui/icons';

const ErrorAlert = ({ children, border, scrollTo }) => (
  <div className={styles.ErrorAlert} data-testid="ErrorAlert">
    <Alert
      border={border}
      scrollTo={scrollTo}
      className="text-red-700 border-red-200 bg-red-50"
      icon={<ErrorIcon />}
    >
      {children}
    </Alert>
  </div>
);

ErrorAlert.propTypes = {
  children: PropTypes.node,
  border: PropTypes.bool,
  scrollTo: PropTypes.bool,
};

ErrorAlert.defaultProps = {};

export default ErrorAlert;
