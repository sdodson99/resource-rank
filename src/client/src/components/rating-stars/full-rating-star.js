import React from 'react';
import PropTypes from 'prop-types';
import { StarFill } from 'react-bootstrap-icons';

function FullRatingStar({ width = 20 }) {
  return (
    <StarFill
      aria-label="star-full"
      height={width}
      width={width}
      fill="#e38100"
    />
  );
}

FullRatingStar.propTypes = {
  width: PropTypes.number,
};

export default FullRatingStar;
