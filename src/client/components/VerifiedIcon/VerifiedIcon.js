import React from 'react';
import PropTypes from 'prop-types';
import styles from './VerifiedIcon.module.css';
import { CheckCircle } from '@material-ui/icons';

const VerifiedIcon = ({ size }) => (
  <div className={styles.VerifiedIcon} data-testid="VerifiedIcon">
    <CheckCircle htmlColor={'#6f99f2'} style={{ fontSize: size }} />
  </div>
);

VerifiedIcon.propTypes = {
  size: PropTypes.number,
};

VerifiedIcon.defaultProps = {
  size: 20,
};

export default VerifiedIcon;
