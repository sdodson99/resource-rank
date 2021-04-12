import React from 'react';
import PropTypes from 'prop-types';

function ListingItem({ children }) {
  return <div className="border border-1 p-3 mb-2">{children}</div>;
}

ListingItem.propTypes = {
  children: PropTypes.node,
};

export default ListingItem;
