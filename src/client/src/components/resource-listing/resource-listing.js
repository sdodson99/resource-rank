import React from 'react';
import PropTypes from 'prop-types';
import ResourceListingItem from '../resource-listing-item/resource-listing-item';

function ResourceListing({ resources }) {
  const resourceListingItems = resources.map((r) => (
    <div key={r.id}>
      <ResourceListingItem
        id={r.id}
        name={r.name}
        ratings={r.ratings}
        link={r.link}
      />
    </div>
  ));

  return <div>{resourceListingItems}</div>;
}

ResourceListing.propTypes = {
  resources: PropTypes.array,
};

export default ResourceListing;
