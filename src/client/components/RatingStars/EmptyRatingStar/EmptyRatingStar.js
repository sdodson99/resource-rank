import React from 'react';
import PropTypes from 'prop-types';
import styles from './EmptyRatingStar.module.css';
import { StarRounded } from '@material-ui/icons';

const EmptyRatingStar = ({ size }) => (
  <div className={styles.EmptyRatingStar} data-testid="EmptyRatingStar">
    <StarRounded htmlColor={'#d6d6d6'} style={{ fontSize: size }} />
  </div>
);

EmptyRatingStar.propTypes = {
  size: PropTypes.number,
};

EmptyRatingStar.defaultProps = {
  size: 20,
};

export default EmptyRatingStar;
