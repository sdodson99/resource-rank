import React from 'react';
import PropTypes from 'prop-types';
import { StarHalf } from 'react-bootstrap-icons';

function HalfRatingStar({ width = 20 }) {
  return (
    <StarHalf
      aria-label="star-half"
      height={width}
      width={width}
      fill="#e38100"
    />
  );
}

HalfRatingStar.propTypes = {
  width: PropTypes.number,
};

export default HalfRatingStar;
