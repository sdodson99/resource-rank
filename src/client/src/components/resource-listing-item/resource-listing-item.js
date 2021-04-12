import React from 'react';
import PropTypes from 'prop-types';
import ListingItem from '../listing-item/listing-item';

function ResourceListingItem({ id, name, link, ratings }) {
  const ratingTotal = ratings
    .map((r) => r.value)
    .reduce((total, value) => (total += value));
  const rating = ratingTotal / ratings.length;
  const ratingDisplay = rating.toFixed(2);

  return (
    <ListingItem>
      <div className="row align-items-center justify-content-between">
        <div className="col-auto">{name}</div>
        <div className="col-auto">{ratingDisplay} / 5</div>
      </div>
      {link && (
        <div className="mt-3">
          <a href={link} target="_blank" className="font-xs" rel="noreferrer">
            {link}
          </a>
        </div>
      )}
    </ListingItem>
  );
}

ResourceListingItem.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  link: PropTypes.string,
  ratings: PropTypes.array,
};

export default ResourceListingItem;
