import React from 'react';
import PropTypes from 'prop-types';

function ListingItem({ children }) {
  return <div className="py-3 border-bottom">{children}</div>;
}

ListingItem.propTypes = {
  children: PropTypes.node,
};

export default ListingItem;
