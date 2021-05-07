import React from 'react';
import PropTypes from 'prop-types';
import RatingStars from '../rating-stars/rating-stars';

function getAverageRating(ratings) {
  if (ratings.length === 0) {
    return 0;
  }

  const ratingTotal = ratings
    .map((r) => r.value)
    .filter((r) => r >= 0 && r <= 5)
    .reduce((total, value) => (total += value), 0);

  return ratingTotal / ratings.length;
}

function AverageRatingStars({ ratings }) {
  const rating = getAverageRating(ratings);

  return <RatingStars rating={rating} />;
}

AverageRatingStars.propTypes = {
  ratings: PropTypes.array,
};

export default AverageRatingStars;
