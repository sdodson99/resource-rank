import React from 'react';
import PropTypes from 'prop-types';
import styles from './VerifiedIcon.module.css';
import { CheckCircle } from '@material-ui/icons';
import { Tooltip } from '@material-ui/core';

const VerifiedIcon = ({ size }) => (
  <div className={styles.VerifiedIcon} data-testid="VerifiedIcon">
    <Tooltip
      title="Verified"
      aria-label="verified"
      arrow="true"
      placement="right"
    >
      <CheckCircle htmlColor={'#6f99f2'} style={{ fontSize: size }} />
    </Tooltip>
  </div>
);

VerifiedIcon.propTypes = {
  size: PropTypes.number,
};

VerifiedIcon.defaultProps = {
  size: 20,
};

export default VerifiedIcon;
