import React from 'react';
import PropTypes from 'prop-types';
import { StarFill, StarHalf } from 'react-bootstrap-icons';

const MAX_RATING = 5;

const isHalfStar = (rating) => rating >= 0.3 && rating <= 0.7;
const isFullStar = (rating) => rating > 0.7;

const StarHalfFilled = () => <StarHalf aria-label="star-half" fill="#e38100" />;
const StarFullFilled = () => <StarFill aria-label="star-full" fill="#e38100" />;
const StarEmpty = () => <StarFill aria-label="star-empty" fill="#d6d6d6" />;

const getStar = (rating) => {
  if (isHalfStar(rating)) {
    return <StarHalfFilled />;
  }

  if (isFullStar(rating)) {
    return <StarFullFilled />;
  }

  return <StarEmpty />;
};

function RatingStars({ rating }) {
  const stars = [];

  for (let i = 0; i < MAX_RATING; i++) {
    const currentRating = rating - i;
    const star = (
      <div key={i} className="me-1 d-inline">
        {getStar(currentRating)}
      </div>
    );

    stars.push(star);
  }

  return stars;
}

RatingStars.propTypes = {
  rating: PropTypes.number,
};

export default RatingStars;
