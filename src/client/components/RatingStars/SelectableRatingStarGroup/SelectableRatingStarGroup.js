import React from 'react';
import PropTypes from 'prop-types';
import styles from './SelectableRatingStarGroup.module.css';
import RatingStarGroup from '../RatingStarGroup/RatingStarGroup';

const SelectableRatingStarGroup = ({
  rating,
  maxRating,
  starSize,
  onRatingChanged,
}) => (
  <div
    className={styles.SelectableRatingStarGroup}
    data-testid="SelectableRatingStarGroup"
  >
    <RatingStarGroup
      rating={rating}
      starSize={starSize}
      maxRating={maxRating}
      onStarClick={(index) => onRatingChanged && onRatingChanged(index + 1)}
    />
  </div>
);

SelectableRatingStarGroup.propTypes = {
  rating: PropTypes.number,
  maxRating: PropTypes.number,
  starSize: PropTypes.number,
  onRatingChanged: PropTypes.func,
};

SelectableRatingStarGroup.defaultProps = {
  rating: 0,
  maxRating: 5,
  starSize: 20,
};

export default SelectableRatingStarGroup;
