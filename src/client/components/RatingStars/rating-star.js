import React from 'react';
import PropTypes from 'prop-types';
import HalfRatingStar from './half-rating-star';
import FullRatingStar from './full-rating-star';
import EmptyRatingStar from './empty-rating-star';

const isHalfStar = (rating) => rating >= 0.3 && rating <= 0.7;
const isFullStar = (rating) => rating > 0.7;

function RatingStar({ rating, width }) {
  if (isHalfStar(rating)) {
    return <HalfRatingStar width={width} />;
  }

  if (isFullStar(rating)) {
    return <FullRatingStar width={width} />;
  }

  return <EmptyRatingStar width={width} />;
}

RatingStar.propTypes = {
  width: PropTypes.number,
  rating: PropTypes.number,
};

export default RatingStar;
