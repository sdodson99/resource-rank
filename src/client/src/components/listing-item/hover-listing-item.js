import React from 'react';
import PropTypes from 'prop-types';
import ListingItem from './listing-item';

import * as style from './hover-listing-item.module.css';

function HoverListingItem({ children }) {
  return (
    <div className={style.listingItem}>
      <ListingItem>{children}</ListingItem>
    </div>
  );
}

HoverListingItem.propTypes = {
  children: PropTypes.node,
};

export default HoverListingItem;
