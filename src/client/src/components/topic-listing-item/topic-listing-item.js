import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'gatsby';
import ListingItem from '../listing-item/listing-item';

function TopicListingItem({ id, name }) {
  const resourcesLink = `/topics/${id}`;

  return (
    <ListingItem>
      <div className="row align-items-center justify-content-between">
        <div className="col-sm-auto">{name}</div>
        <div className="col-sm-auto font-xs">
          <Link to={resourcesLink}>Resources</Link>
        </div>
      </div>
    </ListingItem>
  );
}

TopicListingItem.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
};

export default TopicListingItem;
