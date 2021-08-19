import React from 'react';
import PropTypes from 'prop-types';
import styles from './InfoAlert.module.css';
import Alert from '../Alert/Alert';
import { Info } from '@material-ui/icons';

const InfoAlert = ({ children, border, scrollTo }) => (
  <div className={styles.InfoAlert} data-testid="InfoAlert">
    <Alert
      border={border}
      scrollTo={scrollTo}
      className="text-blue-800 border-blue-200 bg-blue-50"
      icon={<Info />}
    >
      {children}
    </Alert>
  </div>
);

InfoAlert.propTypes = {
  children: PropTypes.node,
  border: PropTypes.bool,
  scrollTo: PropTypes.bool,
};

InfoAlert.defaultProps = {};

export default InfoAlert;
