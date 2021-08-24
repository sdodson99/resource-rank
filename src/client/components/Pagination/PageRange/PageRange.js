import React from 'react';
import Page from '../Page/Page';
import PropTypes from 'prop-types';

const PageRange = ({ first, last, onClick }) => {
  const pages = [];

  for (let page = first; page <= last; page++) {
    pages.push(<Page key={page} number={page} onClick={onClick} />);
  }

  return pages;
};

PageRange.propTypes = {
  first: PropTypes.number,
  last: PropTypes.number,
  onClick: PropTypes.func,
};

PageRange.defaultProps = {
  first: 1,
  last: 2,
};

export default PageRange;
