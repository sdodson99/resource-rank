import React from 'react';
import PropTypes from 'prop-types';
import styles from './RatingStarGroup.module.css';
import RatingStar from '../RatingStar/RatingStar';

const RatingStarGroup = ({ rating, maxRating, starSize, onStarClick }) => {
  const getRatingStarsForRating = () => {
    const stars = [];

    for (let i = 0; i < maxRating; i++) {
      const fill = rating - i;
      const star = (
        <div
          key={i}
          data-testid="RatingStarGroup_RatingStar"
          onClick={() => onStarClick && onStarClick(i)}
        >
          <RatingStar fill={fill} size={starSize} color={'orange'} />
        </div>
      );

      stars.push(star);
    }

    return stars;
  };

  return (
    <div className={styles.RatingStarGroup} data-testid="RatingStarGroup">
      {getRatingStarsForRating()}
    </div>
  );
};

RatingStarGroup.propTypes = {
  rating: PropTypes.number,
  maxRating: PropTypes.number,
  starSize: PropTypes.number,
  onStarClick: PropTypes.func,
};

RatingStarGroup.defaultProps = {
  rating: 0,
  maxRating: 5,
  starSize: 20,
};

export default RatingStarGroup;
