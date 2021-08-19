import React from 'react';
import PropTypes from 'prop-types';
import styles from './RatingStar.module.css';
import HalfRatingStar from '../HalfRatingStar/HalfRatingStar';
import FullRatingStar from '../FullRatingStar/FullRatingStar';
import EmptyRatingStar from '../EmptyRatingStar/EmptyRatingStar';

const RatingStar = ({ fill, size, color }) => {
  const getRatingStarForFill = () => {
    const isHalfStar = fill >= 0.3 && fill <= 0.7;
    if (isHalfStar) {
      return <HalfRatingStar size={size} color={color} />;
    }

    const isFullStar = fill > 0.7;
    if (isFullStar) {
      return <FullRatingStar size={size} color={color} />;
    }

    return <EmptyRatingStar size={size} />;
  };

  return (
    <div className={styles.RatingStar} data-testid="RatingStar">
      {getRatingStarForFill()}
    </div>
  );
};

RatingStar.propTypes = {
  fill: PropTypes.number,
  size: PropTypes.number,
  color: PropTypes.string,
};

RatingStar.defaultProps = {
  fill: 0,
  size: 20,
  color: 'black',
};

export default RatingStar;
