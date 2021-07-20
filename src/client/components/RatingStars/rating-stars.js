import React from 'react';
import PropTypes from 'prop-types';
import RatingStar from './rating-star';

const MAX_RATING = 5;

function RatingStars({ rating, starWidth, onStarMouseOver, onStarClick }) {
  const stars = [];

  const onStarMouseOverHandler = (starIndex) => {
    if (onStarMouseOver) {
      onStarMouseOver(starIndex);
    }
  };

  const onStarClickHandler = (starIndex) => {
    if (onStarClick) {
      onStarClick(starIndex);
    }
  };

  for (let i = 0; i < MAX_RATING; i++) {
    const currentRating = rating - i;
    const star = (
      <div
        key={i}
        className="mr-1"
        onMouseOver={() => onStarMouseOverHandler(i)}
        onClick={() => onStarClickHandler(i)}
      >
        <RatingStar rating={currentRating} width={starWidth} />
      </div>
    );

    stars.push(star);
  }

  return <div className="flex">{stars}</div>;
}

RatingStars.propTypes = {
  rating: PropTypes.number,
  starWidth: PropTypes.number,
  onStarMouseOver: PropTypes.func,
  onStarClick: PropTypes.func,
};

export default RatingStars;
