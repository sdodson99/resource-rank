import React from 'react';
import PropTypes from 'prop-types';
import styles from './FullRatingStar.module.css';
import { StarRounded } from '@material-ui/icons';

const FullRatingStar = ({ size, color }) => (
  <div className={styles.FullRatingStar} data-testid="FullRatingStar">
    <StarRounded htmlColor={color} style={{ fontSize: size }} />
  </div>
);

FullRatingStar.propTypes = {
  size: PropTypes.number,
  color: PropTypes.string,
};

FullRatingStar.defaultProps = {
  size: 20,
  color: 'black',
};

export default FullRatingStar;
