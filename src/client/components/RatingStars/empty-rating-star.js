import React from 'react';
import PropTypes from 'prop-types';
import { StarFill } from 'react-bootstrap-icons';

function EmptyRatingStar({ width = 20 }) {
  return (
    <StarFill
      aria-label="star-empty"
      height={width}
      width={width}
      fill="#d6d6d6"
    />
  );
}

EmptyRatingStar.propTypes = {
  width: PropTypes.number,
};

export default EmptyRatingStar;
