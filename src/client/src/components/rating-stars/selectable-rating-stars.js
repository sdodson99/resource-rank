import React from 'react';
import PropTypes from 'prop-types';
import RatingStars from './rating-stars';

function SelectableRatingStars({
  starWidth,
  selectedRating,
  selectedRatingChanged,
}) {
  const onStarClick = (starIndex) => {
    if (selectedRatingChanged) {
      const selectedRating = starIndex + 1;
      selectedRatingChanged(selectedRating);
    }
  };

  return (
    <div style={{ cursor: 'pointer' }}>
      <RatingStars
        rating={selectedRating}
        starWidth={starWidth}
        onStarClick={onStarClick}
      />
    </div>
  );
}

SelectableRatingStars.propTypes = {
  starWidth: PropTypes.number,
  selectedRating: PropTypes.number,
  selectedRatingChanged: PropTypes.func,
};

export default SelectableRatingStars;
