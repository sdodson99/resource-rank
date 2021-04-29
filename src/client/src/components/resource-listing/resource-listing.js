import React from 'react';
import PropTypes from 'prop-types';
import ResourceListingItem from '../resource-listing-item/resource-listing-item';

function ResourceListing({ resources }) {
  const resourceListingItems = resources.map((r) => (
    <div key={r.resourceInfo.id}>
      <ResourceListingItem
        id={r.resourceInfo.id}
        name={r.resourceInfo.name}
        ratings={r.ratings}
        link={r.resourceInfo.link}
      />
    </div>
  ));

  return <div>{resourceListingItems}</div>;
}

ResourceListing.propTypes = {
  resources: PropTypes.array,
};

export default ResourceListing;
