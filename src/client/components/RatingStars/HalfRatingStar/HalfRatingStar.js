import React from 'react';
import PropTypes from 'prop-types';
import styles from './HalfRatingStar.module.css';
import { StarHalfRounded } from '@material-ui/icons';

const HalfRatingStar = ({ size, color }) => (
  <div className={styles.HalfRatingStar} data-testid="HalfRatingStar">
    <StarHalfRounded htmlColor={color} style={{ fontSize: size }} />
  </div>
);

HalfRatingStar.propTypes = {
  size: PropTypes.number,
  color: PropTypes.string,
};

HalfRatingStar.defaultProps = {
  size: 20,
  color: 'black',
};

export default HalfRatingStar;
